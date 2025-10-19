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
var macaddr8_exports = {};
__export(macaddr8_exports, {
  PgMacaddr8: () => PgMacaddr8,
  PgMacaddr8Builder: () => PgMacaddr8Builder,
  macaddr8: () => macaddr8
});
module.exports = __toCommonJS(macaddr8_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class PgMacaddr8Builder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgMacaddr8Builder";
  constructor(name) {
    super(name, "string", "PgMacaddr8");
  }
  /** @internal */
  build(table) {
    return new PgMacaddr8(table, this.config);
  }
}
class PgMacaddr8 extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgMacaddr8";
  getSQLType() {
    return "macaddr8";
  }
}
function macaddr8(name) {
  return new PgMacaddr8Builder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgMacaddr8,
  PgMacaddr8Builder,
  macaddr8
});
//# sourceMappingURL=macaddr8.cjs.map