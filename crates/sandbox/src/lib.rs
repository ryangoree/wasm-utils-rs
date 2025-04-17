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

#[ts]
struct Token {
    symbol: String,
    /// @default 18
    decimals: Option<u8>,
    total_supply: BigInt,
}

#[ts]
struct Order {
    account: String,
    amount: BigInt,
    token: IToken, // Binding to the `Token` struct
}

/// Foo :)
#[wasm_bindgen(skip_jsdoc)]
pub fn foo(order: IOrder) -> Result<String, Error> {
    let token = order.token();
    let symbol = token.symbol();
    let decimals = token.decimals().unwrap_or(18);
    let total_supply = token.total_supply();
    let account = order.account();
    let amount = order.amount();
    Ok(format!(
        r#"
Token: {symbol}
Decimals: {decimals}
Total Supply: {total_supply}
Account: {account}
Amount: {amount}"#
    ))
}
