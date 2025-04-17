#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import {
	mkdirSync,
	readFileSync,
	renameSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { basename, dirname, resolve } from "node:path";
import lockfile from "proper-lockfile";
import type { CargoToml, PackageJson } from "scripts/types";
import { parse } from "smol-toml";
import manifest from "../package.json";

const __filename = new URL(import.meta.url).pathname;
const __dirname = dirname(__filename);
const script = basename(__filename);

// SETTINGS
const PACKAGE_SCOPE = "@workspace"; // e.g. "@organization" or "" for no scope
const OUT_DIR = "../../packages";
const TMP_DIR = "tmp";

console.log(`
+
|  ${manifest.name} ${script}
|
|  Generating WASM package from Rust crate...
|
|  Version:          ${manifest.version}
|  Output Directory: ${OUT_DIR}
|  Temp Directory:   ${TMP_DIR}
+
`);

try {
	const release = await lockfile
		// Lock the script to prevent concurrent builds
		.lock(__filename, {
			retries: 3,
			update: 3_000, // 3 seconds
			stale: 60_000 * 10, // 10 minutes
		});

	// Load the Cargo.toml file.
	const cargoManifestPath = resolve(__dirname, "../Cargo.toml");
	const cargoTomlSrc = readFileSync(cargoManifestPath, "utf8");
	const cargoToml = parse(cargoTomlSrc) as unknown as CargoToml;

	// Sync the version with the package.json
	cargoToml.package.version = manifest.version;
	writeFileSync(
		cargoManifestPath,
		cargoTomlSrc.replace(
			// https://regex101.com/r/PLmbXb/1
			/^version(\s*)=(\s*)"[^"]+"/m,
			`version$1=$2"${manifest.version}"`,
		),
	);

	// Build the wasm package.
	console.log("Building package...");
	const buildProcessResult = spawnSync(
		"npx",
		["wasm-pkg-build", "--modules", "cjs,esm-sync", "--out-dir", TMP_DIR],
		{
			stdio: "inherit",
		},
	);

	// Throw an error if the build failed.
	if (buildProcessResult.error) {
		throw buildProcessResult.error;
	}

	const outDir = resolve(OUT_DIR, manifest.name);

	// Copy generated files to the output directory.
	const crateFilePrefix = cargoToml.package.name.replaceAll("-", "_");
	const packageFilePrefix = manifest.name.replaceAll("-", "_");
	const fileNames = [
		{
			from: `${crateFilePrefix}_worker.js`,
			to: `${packageFilePrefix}.js`,
		}, // esm-sync
		{
			from: `${crateFilePrefix}.js`,
			to: `${packageFilePrefix}.cjs`,
		}, // cjs
		{
			from: `${crateFilePrefix}.d.ts`,
			to: `${packageFilePrefix}.d.ts`,
		}, // types
		{
			from: `${crateFilePrefix}_bg.wasm`,
			to: `${packageFilePrefix}_bg.wasm`,
		}, // wasm for cjs
	];
	for (const { from, to } of fileNames) {
		mkdirSync(outDir, { recursive: true });
		renameSync(resolve(TMP_DIR, from), resolve(outDir, to));
	}

	// Remove the temporary build files.
	console.log("Removing temporary build files...");
	rmSync(TMP_DIR, { recursive: true });

	console.log("Creating package.json...");
	const packageJson = buildPackageJsonFromCargoToml(cargoToml, fileNames);

	// Save the package.json to the output directory.
	writeFileSync(
		resolve(outDir, "package.json"),
		JSON.stringify(packageJson, null, 2),
	);

	// Release the lockfile
	release();
	console.log("Done!");
	process.exit(0);
} catch (err) {
	console.error(err);
	lockfile.unlock(__filename);
	process.exit(1);
}

/**
 * Generates a package.json given a list of generated files.
 *
 * @param cargoToml The parsed Cargo.toml file.k
 * @param fileNames A list of generated files where each item contains the
 *   "from" (the original file name) and "to" (the desired file name in the
 *   output directory) properties.
 *
 * @returns The generated package.json object.
 */
function buildPackageJsonFromCargoToml(
	cargoToml: CargoToml,
	fileNames: { from: string; to: string }[],
): PackageJson {
	const filePrefix = manifest.name.replaceAll("-", "_");
	// Create the package.json.
	const packageJson: PackageJson = {
		name: `${PACKAGE_SCOPE ? `${PACKAGE_SCOPE}/` : ""}${manifest.name}`,
		version: cargoToml.package.version,
		license: cargoToml.package.license,
		files: fileNames.map(({ to }) => to),
		sideEffects: ["./snippets/*"],
		type: "module",
		// Add a main field for improved commonjs compatibility.
		main: `${filePrefix}.cjs`,
		types: `${filePrefix}.d.ts`,
		// Add exports for both ESM and CJS compatibility for modern node versions.
		exports: {
			".": {
				default: {
					require: `./${filePrefix}.cjs`,
					import: `./${filePrefix}.js`,
					types: `./${filePrefix}.d.ts`,
				},
			},
		},
		// Explicitly set the publishConfig access to public to ensure it's published
		// by changesets.
		publishConfig: {
			access: "public",
		},
	};

	if (cargoToml.package.authors?.length) {
		packageJson.collaborators = cargoToml.package.authors.filter(Boolean);
	}

	return packageJson;
}
