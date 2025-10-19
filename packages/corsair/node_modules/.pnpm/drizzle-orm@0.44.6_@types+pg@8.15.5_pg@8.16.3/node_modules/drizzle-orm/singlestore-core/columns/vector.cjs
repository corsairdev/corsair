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
  SingleStoreVector: () => SingleStoreVector,
  SingleStoreVectorBuilder: () => SingleStoreVectorBuilder,
  vector: () => vector
});
module.exports = __toCommonJS(vector_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SingleStoreVectorBuilder extends import_common.SingleStoreColumnBuilder {
  static [import_entity.entityKind] = "SingleStoreVectorBuilder";
  constructor(name, config) {
    super(name, "array", "SingleStoreVector");
    this.config.dimensions = config.dimensions;
    this.config.elementType = config.elementType;
  }
  /** @internal */
  build(table) {
    return new SingleStoreVector(
      table,
      this.config
    );
  }
  /** @internal */
  generatedAlwaysAs(as, config) {
    throw new Error("not implemented");
  }
}
class SingleStoreVector extends import_common.SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreVector";
  dimensions = this.config.dimensions;
  elementType = this.config.elementType;
  getSQLType() {
    return `vector(${this.dimensions}, ${this.elementType || "F32"})`;
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    return JSON.parse(value);
  }
}
function vector(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new SingleStoreVectorBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreVector,
  SingleStoreVectorBuilder,
  vector
});
//# sourceMappingURL=vector.cjs.map