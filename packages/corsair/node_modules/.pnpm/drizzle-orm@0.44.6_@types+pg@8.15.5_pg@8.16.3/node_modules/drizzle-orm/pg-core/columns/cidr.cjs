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
var cidr_exports = {};
__export(cidr_exports, {
  PgCidr: () => PgCidr,
  PgCidrBuilder: () => PgCidrBuilder,
  cidr: () => cidr
});
module.exports = __toCommonJS(cidr_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class PgCidrBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgCidrBuilder";
  constructor(name) {
    super(name, "string", "PgCidr");
  }
  /** @internal */
  build(table) {
    return new PgCidr(table, this.config);
  }
}
class PgCidr extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgCidr";
  getSQLType() {
    return "cidr";
  }
}
function cidr(name) {
  return new PgCidrBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgCidr,
  PgCidrBuilder,
  cidr
});
//# sourceMappingURL=cidr.cjs.map