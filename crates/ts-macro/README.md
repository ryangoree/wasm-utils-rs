# ts-macro

[![crates.io](https://img.shields.io/crates/v/ts-macro?color=ffc933)](https://crates.io/crates/ts-macro)
[![docs.rs](https://img.shields.io/docsrs/ts-macro)](https://docs.rs/ts-macro)
[![License:
Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-23454d)](./LICENSE)

`ts-macro` is a Rust procedural macro crate for generating TypeScript interface
bindings from Rust structs. It's designed for seamless Rust <-> TypeScript
interop in `wasm-bindgen` projects, making it easy to expose Rust types to
JavaScript and TypeScript consumers.

![TypeScript interface doc comment preview](assets/ts-macro-comment.gif)

## Overview

- **Automatic TypeScript Interface Generation:** Annotate your Rust struct with
  `#[ts]` to generate a TypeScript interface with camelCase field names and
  accurate TypeScript types.
- **wasm-bindgen & js-sys Support:** Designed for use with `wasm-bindgen` and
  supports all JavaScript standard, built-in objects via `js-sys`.
- **No Boilerplate:** Field getter bindings and conversion methods are generated
  for you—no manual parsing required.
- **Customizable Bindings:** Use attributes to control TypeScript field names,
  types, and optionality.
- **Nested Structs:** Apply `#[ts]` to each struct to support nested TypeScript
  interfaces.
- **Extensible Interfaces:** Use the `extends` argument to extend TypeScript
  interfaces.

## Example

```rust
#[ts]
struct Token {
    symbol: String,
    /// @default 18
    decimals: Option<u8>,
    total_supply: BigInt,
}

#[wasm_bindgen]
pub fn handle_token(token: IToken) {
    // Access fields via JS bindings
    let symbol = token.symbol();
    let decimals = token.decimals().unwrap_or(18.into());
    let total_supply = token.total_supply();

    // Convert the JS binding into the Rust struct via `parse`
    let token = token.parse();

    // Convert the Rust struct into the JS binding via `Into` / `From`
    let token: Token = token.into();
}
```

This generates the following TypeScript interface:

```typescript
interface IToken {
  symbol: string;
  /**
   * @default 18
   */
  decimals?: number | undefined;
  totalSupply: bigint;
}
```

## Nested Structs

To nest structs, apply the `ts` attribute to each struct individually. Then, the
bindings can be used as fields in other structs:

```rust
#[ts]
struct Order {
    account: String,
    amount: BigInt,
    token: IToken, // Binding to the `Token` struct
}
```

## Arguments

The `ts` attribute accepts the following arguments when applied to a struct:

- `name`: The name of the TypeScript interface and binding. Defaults to
  `I{{StructName}}`.
- `extends`: A comma-separated list of interfaces to extend.

```rust
#[ts(name = JsToken)]
struct Token {
    symbol: String,
    decimals: Number,
    total_supply: BigInt,
}

#[ts(name = JsShareToken, extends = JsToken)]
struct ShareToken {
    price: BigInt,
}

#[wasm_bindgen]
pub fn handle_token(token: JsShareToken) {
    let symbol = token.symbol(); // Access base struct fields
}
```

This will generate the following TypeScript interfaces:

```typescript
interface JsToken {
  // ...
}
interface JsShareToken extends JsToken {
  // ...
}
```

## Field Arguments

To customize the TypeScript interface, the `ts` attribute can be applied to
individual fields of the struct. The attribute accepts the following arguments:

- `name`: The name of the field in the TypeScript interface as a string.
  Defaults to the camelCase version of the Rust field name.
- `type`: The TypeScript type of the field as a string. Defaults to best-effort
  inferred.
- `optional`: Whether the field is optional in TypeScript. Defaults to inferred.

```rust
#[ts]
struct Params {
    #[ts(name = "specialCASING")]
    special_casing: String,

    #[ts(type = "`0x${string}`")]
    special_format: String,

    // The `Option` type is inferred as optional
    optional_field_and_value: Option<String>,

    #[ts(optional = false)]
    optional_value: Option<String>,

    // CAUTION: This will make the field optional in TypeScript, but Rust
    // will still expect a String, requiring manual runtime checks.
    #[ts(optional = true)]
    optional_field: String,
}
```

This generates:

```typescript
interface IParams {
  specialCASING: string;
  specialFormat: `0x${string}`;
  optionalFieldAndValue?: string | undefined;
  optionalValue: string | undefined;
  optionalField?: string;
}
```

## Similar Projects

- [`ts-rs`](https://github.com/Aleph-Alpha/ts-rs) – Generates TypeScript
  definition files from Rust structs and enums, but isn’t integrated with
  wasm-bindgen and doesn’t include bindings to parse the type from a JS value.
- [`tauri-specta`](https://docs.rs/tauri-specta/) – Similar idea for
  [Tauri](https://tauri.app/) app backends.
- [`tsify`](https://github.com/madonoharu/tsify) – Same idea, but is built on
  [`serde-wasm-bindgen`](https://github.com/RReverser/serde-wasm-bindgen) which
  doesn’t parse JS types, so APIs are limited to numbers and strings.

## License

This project is licensed under the [Apache 2.0](../LICENSE).
