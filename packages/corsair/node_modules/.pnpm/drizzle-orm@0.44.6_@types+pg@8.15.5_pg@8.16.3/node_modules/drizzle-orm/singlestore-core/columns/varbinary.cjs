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
var varbinary_exports = {};
__export(varbinary_exports, {
  SingleStoreVarBinary: () => SingleStoreVarBinary,
  SingleStoreVarBinaryBuilder: () => SingleStoreVarBinaryBuilder,
  varbinary: () => varbinary
});
module.exports = __toCommonJS(varbinary_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SingleStoreVarBinaryBuilder extends import_common.SingleStoreColumnBuilder {
  static [import_entity.entityKind] = "SingleStoreVarBinaryBuilder";
  /** @internal */
  constructor(name, config) {
    super(name, "string", "SingleStoreVarBinary");
    this.config.length = config?.length;
  }
  /** @internal */
  build(table) {
    return new SingleStoreVarBinary(
      table,
      this.config
    );
  }
}
class SingleStoreVarBinary extends import_common.SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreVarBinary";
  length = this.config.length;
  mapFromDriverValue(value) {
    if (typeof value === "string") return value;
    if (Buffer.isBuffer(value)) return value.toString();
    const str = [];
    for (const v of value) {
      str.push(v === 49 ? "1" : "0");
    }
    return str.join("");
  }
  getSQLType() {
    return this.length === void 0 ? `varbinary` : `varbinary(${this.length})`;
  }
}
function varbinary(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new SingleStoreVarBinaryBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreVarBinary,
  SingleStoreVarBinaryBuilder,
  varbinary
});
//# sourceMappingURL=varbinary.cjs.map