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
var policies_exports = {};
__export(policies_exports, {
  GelPolicy: () => GelPolicy,
  gelPolicy: () => gelPolicy
});
module.exports = __toCommonJS(policies_exports);
var import_entity = require("../entity.cjs");
class GelPolicy {
  constructor(name, config) {
    this.name = name;
    if (config) {
      this.as = config.as;
      this.for = config.for;
      this.to = config.to;
      this.using = config.using;
      this.withCheck = config.withCheck;
    }
  }
  static [import_entity.entityKind] = "GelPolicy";
  as;
  for;
  to;
  using;
  withCheck;
  /** @internal */
  _linkedTable;
  link(table) {
    this._linkedTable = table;
    return this;
  }
}
function gelPolicy(name, config) {
  return new GelPolicy(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelPolicy,
  gelPolicy
});
//# sourceMappingURL=policies.cjs.map