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
var integer_exports = {};
__export(integer_exports, {
  PgInteger: () => PgInteger,
  PgIntegerBuilder: () => PgIntegerBuilder,
  integer: () => integer
});
module.exports = __toCommonJS(integer_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
var import_int_common = require("./int.common.cjs");
class PgIntegerBuilder extends import_int_common.PgIntColumnBaseBuilder {
  static [import_entity.entityKind] = "PgIntegerBuilder";
  constructor(name) {
    super(name, "number", "PgInteger");
  }
  /** @internal */
  build(table) {
    return new PgInteger(table, this.config);
  }
}
class PgInteger extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgInteger";
  getSQLType() {
    return "integer";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number.parseInt(value);
    }
    return value;
  }
}
function integer(name) {
  return new PgIntegerBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgInteger,
  PgIntegerBuilder,
  integer
});
//# sourceMappingURL=integer.cjs.map