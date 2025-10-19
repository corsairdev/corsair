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
var binary_exports = {};
__export(binary_exports, {
  SingleStoreBinary: () => SingleStoreBinary,
  SingleStoreBinaryBuilder: () => SingleStoreBinaryBuilder,
  binary: () => binary
});
module.exports = __toCommonJS(binary_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SingleStoreBinaryBuilder extends import_common.SingleStoreColumnBuilder {
  static [import_entity.entityKind] = "SingleStoreBinaryBuilder";
  constructor(name, length) {
    super(name, "string", "SingleStoreBinary");
    this.config.length = length;
  }
  /** @internal */
  build(table) {
    return new SingleStoreBinary(
      table,
      this.config
    );
  }
}
class SingleStoreBinary extends import_common.SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreBinary";
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
    return this.length === void 0 ? `binary` : `binary(${this.length})`;
  }
}
function binary(a, b = {}) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new SingleStoreBinaryBuilder(name, config.length);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreBinary,
  SingleStoreBinaryBuilder,
  binary
});
//# sourceMappingURL=binary.cjs.map