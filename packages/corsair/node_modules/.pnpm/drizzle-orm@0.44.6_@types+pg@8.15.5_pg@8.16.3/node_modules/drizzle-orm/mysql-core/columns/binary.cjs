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
  MySqlBinary: () => MySqlBinary,
  MySqlBinaryBuilder: () => MySqlBinaryBuilder,
  binary: () => binary
});
module.exports = __toCommonJS(binary_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlBinaryBuilder extends import_common.MySqlColumnBuilder {
  static [import_entity.entityKind] = "MySqlBinaryBuilder";
  constructor(name, length) {
    super(name, "string", "MySqlBinary");
    this.config.length = length;
  }
  /** @internal */
  build(table) {
    return new MySqlBinary(table, this.config);
  }
}
class MySqlBinary extends import_common.MySqlColumn {
  static [import_entity.entityKind] = "MySqlBinary";
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
  return new MySqlBinaryBuilder(name, config.length);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlBinary,
  MySqlBinaryBuilder,
  binary
});
//# sourceMappingURL=binary.cjs.map