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
var halfvec_exports = {};
__export(halfvec_exports, {
  PgHalfVector: () => PgHalfVector,
  PgHalfVectorBuilder: () => PgHalfVectorBuilder,
  halfvec: () => halfvec
});
module.exports = __toCommonJS(halfvec_exports);
var import_entity = require("../../../entity.cjs");
var import_utils = require("../../../utils.cjs");
var import_common = require("../common.cjs");
class PgHalfVectorBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgHalfVectorBuilder";
  constructor(name, config) {
    super(name, "array", "PgHalfVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgHalfVector(
      table,
      this.config
    );
  }
}
class PgHalfVector extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgHalfVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `halfvec(${this.dimensions})`;
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
  }
}
function halfvec(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new PgHalfVectorBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgHalfVector,
  PgHalfVectorBuilder,
  halfvec
});
//# sourceMappingURL=halfvec.cjs.map