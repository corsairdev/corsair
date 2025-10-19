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
  GelDoublePrecision: () => GelDoublePrecision,
  GelDoublePrecisionBuilder: () => GelDoublePrecisionBuilder,
  doublePrecision: () => doublePrecision
});
module.exports = __toCommonJS(double_precision_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class GelDoublePrecisionBuilder extends import_common.GelColumnBuilder {
  static [import_entity.entityKind] = "GelDoublePrecisionBuilder";
  constructor(name) {
    super(name, "number", "GelDoublePrecision");
  }
  /** @internal */
  build(table) {
    return new GelDoublePrecision(
      table,
      this.config
    );
  }
}
class GelDoublePrecision extends import_common.GelColumn {
  static [import_entity.entityKind] = "GelDoublePrecision";
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
  return new GelDoublePrecisionBuilder(name ?? "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelDoublePrecision,
  GelDoublePrecisionBuilder,
  doublePrecision
});
//# sourceMappingURL=double-precision.cjs.map