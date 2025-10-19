"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ws_exports = {};
__export(ws_exports, {
  drizzle: () => drizzle
});
module.exports = __toCommonJS(ws_exports);
var import_ws = require("@libsql/client/ws");
var import_utils = require("../../utils.cjs");
var import_driver_core = require("../driver-core.cjs");
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const instance = (0, import_ws.createClient)({
      url: params[0]
    });
    return (0, import_driver_core.construct)(instance, params[1]);
  }
  if ((0, import_utils.isConfig)(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client) return (0, import_driver_core.construct)(client, drizzleConfig);
    const instance = typeof connection === "string" ? (0, import_ws.createClient)({ url: connection }) : (0, import_ws.createClient)(connection);
    return (0, import_driver_core.construct)(instance, drizzleConfig);
  }
  return (0, import_driver_core.construct)(params[0], params[1]);
}
((drizzle2) => {
  function mock(config) {
    return (0, import_driver_core.construct)({}, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  drizzle
});
//# sourceMappingURL=index.cjs.map