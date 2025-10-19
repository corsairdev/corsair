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
var char_exports = {};
__export(char_exports, {
  SingleStoreChar: () => SingleStoreChar,
  SingleStoreCharBuilder: () => SingleStoreCharBuilder,
  char: () => char
});
module.exports = __toCommonJS(char_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class SingleStoreCharBuilder extends import_common.SingleStoreColumnBuilder {
  static [import_entity.entityKind] = "SingleStoreCharBuilder";
  constructor(name, config) {
    super(name, "string", "SingleStoreChar");
    this.config.length = config.length;
    this.config.enum = config.enum;
  }
  /** @internal */
  build(table) {
    return new SingleStoreChar(
      table,
      this.config
    );
  }
}
class SingleStoreChar extends import_common.SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreChar";
  length = this.config.length;
  enumValues = this.config.enum;
  getSQLType() {
    return this.length === void 0 ? `char` : `char(${this.length})`;
  }
}
function char(a, b = {}) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new SingleStoreCharBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreChar,
  SingleStoreCharBuilder,
  char
});
//# sourceMappingURL=char.cjs.map