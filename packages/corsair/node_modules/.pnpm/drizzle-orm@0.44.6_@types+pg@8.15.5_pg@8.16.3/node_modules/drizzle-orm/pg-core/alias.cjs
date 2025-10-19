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
var alias_exports = {};
__export(alias_exports, {
  alias: () => alias
});
module.exports = __toCommonJS(alias_exports);
var import_alias = require("../alias.cjs");
function alias(table, alias2) {
  return new Proxy(table, new import_alias.TableAliasProxyHandler(alias2, false));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  alias
});
//# sourceMappingURL=alias.cjs.map