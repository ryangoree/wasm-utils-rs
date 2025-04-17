let imports = {};
imports['./sandbox_bg.js'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);
let WASM_VECTOR_LEN = 0;
let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
let cachedTextEncoder = new TextEncoder('utf-8');
const encodeString = typeof cachedTextEncoder.encodeInto === 'function' ? function (arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function (arg, view) {
  const buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}
function isLikeNone(x) {
  return x === undefined || x === null;
}
let cachedTextDecoder = new TextDecoder('utf-8', {
  ignoreBOM: true,
  fatal: true
});
cachedTextDecoder.decode();
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_export_3.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}
/**
 * Foo :)
 */

;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
module.exports.initialize = function () {
  wasm.initialize();
};
module.exports.foo = function (order) {
  let deferred2_0;
  let deferred2_1;
  try {
    const ret = wasm.foo(order);
    var ptr1 = ret[0];
    var len1 = ret[1];
    if (ret[3]) {
      ptr1 = 0;
      len1 = 0;
      throw takeFromExternrefTable0(ret[2]);
    }
    deferred2_0 = ptr1;
    deferred2_1 = len1;
    return getStringFromWasm0(ptr1, len1);
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
  }
};
module.exports.__wbg_BigInt_470dd987b8190f8e = function (arg0) {
  const ret = BigInt(arg0);
  return ret;
};
module.exports.__wbg_account_c8537d5970c64ede = function (arg0, arg1) {
  const ret = arg1.account;
  const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
module.exports.__wbg_amount_eb12f3622eb0b674 = function (arg0) {
  const ret = arg0.amount;
  return ret;
};
module.exports.__wbg_decimals_92ea447d47184ee9 = function (arg0) {
  const ret = arg0.decimals;
  return isLikeNone(ret) ? 0xFFFFFF : ret;
};
module.exports.__wbg_error_7534b8e9a36f1ab4 = function (arg0, arg1) {
  let deferred0_0;
  let deferred0_1;
  try {
    deferred0_0 = arg0;
    deferred0_1 = arg1;
    console.error(getStringFromWasm0(arg0, arg1));
  } finally {
    wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
  }
};
module.exports.__wbg_new_8a6f238a6ece86ea = function () {
  const ret = new Error();
  return ret;
};
module.exports.__wbg_new_b08a00743b8ae2f3 = function (arg0, arg1) {
  const ret = new TypeError(getStringFromWasm0(arg0, arg1));
  return ret;
};
module.exports.__wbg_new_c68d7209be747379 = function (arg0, arg1) {
  const ret = new Error(getStringFromWasm0(arg0, arg1));
  return ret;
};
module.exports.__wbg_stack_0ed75d68575b0f3c = function (arg0, arg1) {
  const ret = arg1.stack;
  const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
module.exports.__wbg_symbol_7fd54b5f89b8bdb7 = function (arg0, arg1) {
  const ret = arg1.symbol;
  const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
module.exports.__wbg_toString_2f76f493957b63da = function (arg0, arg1, arg2) {
  const ret = arg1.toString(arg2);
  const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
module.exports.__wbg_token_62ddd92f7e597a41 = function (arg0) {
  const ret = arg0.token;
  return ret;
};
module.exports.__wbg_totalsupply_c0b3565ba0adae11 = function (arg0) {
  const ret = arg0.totalSupply;
  return ret;
};
module.exports.__wbindgen_init_externref_table = function () {
  const table = wasm.__wbindgen_export_3;
  const offset = table.grow(4);
  table.set(0, undefined);
  table.set(offset + 0, undefined);
  table.set(offset + 1, null);
  table.set(offset + 2, true);
  table.set(offset + 3, false);
  ;
};
module.exports.__wbindgen_lt = function (arg0, arg1) {
  const ret = arg0 < arg1;
  return ret;
};
module.exports.__wbindgen_neg = function (arg0) {
  const ret = -arg0;
  return ret;
};
module.exports.__wbindgen_number_new = function (arg0) {
  const ret = arg0;
  return ret;
};
module.exports.__wbindgen_throw = function (arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
};
const path = require('path').join(__dirname, 'sandbox_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;