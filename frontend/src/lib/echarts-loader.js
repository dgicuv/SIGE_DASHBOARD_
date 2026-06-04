import "./echarts.min.js";
// The UMD build registers itself on globalThis.echarts as a side effect.
// This wrapper re-exports it as proper ESM named exports.
const ec = globalThis.echarts;
export const init = (...args) => ec.init(...args);
