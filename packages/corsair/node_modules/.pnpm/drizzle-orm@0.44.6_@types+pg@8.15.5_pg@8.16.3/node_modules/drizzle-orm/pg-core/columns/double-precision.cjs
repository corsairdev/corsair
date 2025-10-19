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
var double_precision_exports = {};
__export(double_precision_exports, {
  PgDoublePrecision: () => PgDoublePrecision,
  PgDoublePrecisionBuilder: () => PgDoublePrecisionBuilder,
  doublePrecision: () => doublePrecision
});
module.exports = __toCommonJS(double_precision_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class PgDoublePrecisionBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgDoublePrecisionBuilder";
  constructor(name) {
    super(name, "number", "PgDoublePrecision");
  }
  /** @internal */
  build(table) {
    return new PgDoublePrecision(
      table,
      this.config
    );
  }
}
class PgDoublePrecision extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgDoublePrecision";
  getSQLType() {
    return "double precision";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number.parseFloat(value);
    }
    return value;
  }
}
function doublePrecision(name) {
  return new PgDoublePrecisionBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgDoublePrecision,
  PgDoublePrecisionBuilder,
  doublePrecision
});
//# sourceMappingURL=double-precision.cjs.map