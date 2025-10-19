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
var roles_exports = {};
__export(roles_exports, {
  GelRole: () => GelRole,
  gelRole: () => gelRole
});
module.exports = __toCommonJS(roles_exports);
var import_entity = require("../entity.cjs");
class GelRole {
  constructor(name, config) {
    this.name = name;
    if (config) {
      this.createDb = config.createDb;
      this.createRole = config.createRole;
      this.inherit = config.inherit;
    }
  }
  static [import_entity.entityKind] = "GelRole";
  /** @internal */
  _existing;
  /** @internal */
  createDb;
  /** @internal */
  createRole;
  /** @internal */
  inherit;
  existing() {
    this._existing = true;
    return this;
  }
}
function gelRole(name, config) {
  return new GelRole(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelRole,
  gelRole
});
//# sourceMappingURL=roles.cjs.map