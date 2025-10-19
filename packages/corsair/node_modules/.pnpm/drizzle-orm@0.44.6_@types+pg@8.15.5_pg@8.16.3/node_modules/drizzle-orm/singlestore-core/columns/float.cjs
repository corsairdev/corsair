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
var float_exports = {};
__export(float_exports, {
  SingleStoreFloat: () => SingleStoreFloat,
  SingleStoreFloatBuilder: () => SingleStoreFloatBuilder,
  float: () => float
});
module.exports = __toCommonJS(float_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SingleStoreFloatBuilder extends import_common.SingleStoreColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreFloatBuilder";
  constructor(name, config) {
    super(name, "number", "SingleStoreFloat");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new SingleStoreFloat(
      table,
      this.config
    );
  }
}
class SingleStoreFloat extends import_common.SingleStoreColumnWithAutoIncrement {
  static [import_entity.entityKind] = "SingleStoreFloat";
  precision = this.config.precision;
  scale = this.config.scale;
  unsigned = this.config.unsigned;
  getSQLType() {
    let type = "";
    if (this.precision !== void 0 && this.scale !== void 0) {
      type += `float(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      type += "float";
    } else {
      type += `float(${this.precision},0)`;
    }
    return this.unsigned ? `${type} unsigned` : type;
  }
}
function float(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new SingleStoreFloatBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreFloat,
  SingleStoreFloatBuilder,
  float
});
//# sourceMappingURL=float.cjs.map