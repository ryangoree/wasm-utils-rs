import { foo } from "@workspace/sandbox-js";

const result = foo({
	account: "0xAlice",
	amount: 100n,
	token: {
		symbol: "FOO",
		decimals: 18,
		totalSupply: 100n,
	},
});

console.log(result);
