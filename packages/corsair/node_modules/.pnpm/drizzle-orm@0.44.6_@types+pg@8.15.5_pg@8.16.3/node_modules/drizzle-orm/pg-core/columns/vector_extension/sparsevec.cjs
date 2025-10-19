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
var sparsevec_exports = {};
__export(sparsevec_exports, {
  PgSparseVector: () => PgSparseVector,
  PgSparseVectorBuilder: () => PgSparseVectorBuilder,
  sparsevec: () => sparsevec
});
module.exports = __toCommonJS(sparsevec_exports);
var import_entity = require("../../../entity.cjs");
var import_utils = require("../../../utils.cjs");
var import_common = require("../common.cjs");
class PgSparseVectorBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgSparseVectorBuilder";
  constructor(name, config) {
    super(name, "string", "PgSparseVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgSparseVector(
      table,
      this.config
    );
  }
}
class PgSparseVector extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgSparseVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `sparsevec(${this.dimensions})`;
  }
}
function sparsevec(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new PgSparseVectorBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgSparseVector,
  PgSparseVectorBuilder,
  sparsevec
});
//# sourceMappingURL=sparsevec.cjs.map