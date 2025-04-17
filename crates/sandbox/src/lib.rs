use js_sys::BigInt;
use ts_macro::ts;
use utils_core::error::Error;
use wasm_bindgen::prelude::*;

// Initialization function
#[wasm_bindgen(start)]
pub fn initialize() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

/// Foo bar
#[ts]
struct FooParams {
    a: i32,
    b: String,
    c: BigInt,
    d: Option<bool>,
}

/// Foo :)
#[wasm_bindgen(skip_jsdoc)]
pub fn foo(params: IFooParams) -> Result<String, Error> {
    let a = params.a();
    let b = params.b();
    let c = params.c();
    let d = params.d();
    Ok(format!("a: {}, b: {}, c: {}, d: {:?}", a, b, c, d))
}
