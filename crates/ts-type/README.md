# ts-type

`ts-type` helps Rust code reason about TypeScript types. It provides a
structured representation of TypeScript syntax together with helper macros and
conversions that are friendly to procedural macros such as
[`ts-macro`](../ts-macro/README.md).

## Highlights

- `TsType` enum models common TypeScript constructs (unions, tuples, generics,
  indexed access, arrays) with predictable `Display` output.
- `ts_type!` macro builds `TsType` values using TypeScript syntax and allows
  interpolation of previously built fragments.
- Parser and `ToTsType` trait turn `&str` or `syn::Type` values into `TsType`,
  with special behaviour for `Option<T>` and `Vec<T>` to map to
  `| undefined` and `[]` respectively.
- Lightweight `TsTypeError` and `type_error_at!` macro surface precise parsing
  locations when something cannot be represented.

## Usage

### Compose a type inline

```rust
use ts_type::{ts_type, TsType};

let binding: TsType = ts_type!(Record<string, (number | boolean)[]>);
assert_eq!(binding.to_string(), "Record<string, (number | boolean)[]>");
```

### Convert a `syn::Type`

```rust
use syn::parse_quote;
use ts_type::ToTsType;

let rust_ty: syn::Type = parse_quote!(Option<Vec<String>>);
let ts_ty = rust_ty.to_ts_type().unwrap();
assert_eq!(ts_ty.to_string(), "string[] | undefined");
```

### Pair with `ts-macro`

`ts-type` powers the [`#[ts]`](../ts-macro/) attribute. The macro uses
`ToTsType` to infer field types and compose the final TypeScript interface that
gets emitted alongside your bindings.

## License

Licensed under the [Apache-2.0](./LICENSE) license.
