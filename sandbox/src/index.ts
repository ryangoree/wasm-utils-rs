import { foo } from "@workspace/sandbox-js";

const result = foo({
	a: 1,
	b: "hello",
	c: 12345678901234567890n,
	d: true,
});

console.log(result);
