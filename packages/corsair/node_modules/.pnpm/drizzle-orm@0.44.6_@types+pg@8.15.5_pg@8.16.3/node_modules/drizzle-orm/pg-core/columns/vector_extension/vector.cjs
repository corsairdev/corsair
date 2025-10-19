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
var vector_exports = {};
__export(vector_exports, {
  PgVector: () => PgVector,
  PgVectorBuilder: () => PgVectorBuilder,
  vector: () => vector
});
module.exports = __toCommonJS(vector_exports);
var import_entity = require("../../../entity.cjs");
var import_utils = require("../../../utils.cjs");
var import_common = require("../common.cjs");
class PgVectorBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgVectorBuilder";
  constructor(name, config) {
    super(name, "array", "PgVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgVector(
      table,
      this.config
    );
  }
}
class PgVector extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `vector(${this.dimensions})`;
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
  }
}
function vector(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new PgVectorBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgVector,
  PgVectorBuilder,
  vector
});
//# sourceMappingURL=vector.cjs.map