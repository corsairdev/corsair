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
var bit_exports = {};
__export(bit_exports, {
  PgBinaryVector: () => PgBinaryVector,
  PgBinaryVectorBuilder: () => PgBinaryVectorBuilder,
  bit: () => bit
});
module.exports = __toCommonJS(bit_exports);
var import_entity = require("../../../entity.cjs");
var import_utils = require("../../../utils.cjs");
var import_common = require("../common.cjs");
class PgBinaryVectorBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgBinaryVectorBuilder";
  constructor(name, config) {
    super(name, "string", "PgBinaryVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgBinaryVector(
      table,
      this.config
    );
  }
}
class PgBinaryVector extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgBinaryVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `bit(${this.dimensions})`;
  }
}
function bit(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new PgBinaryVectorBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgBinaryVector,
  PgBinaryVectorBuilder,
  bit
});
//# sourceMappingURL=bit.cjs.map