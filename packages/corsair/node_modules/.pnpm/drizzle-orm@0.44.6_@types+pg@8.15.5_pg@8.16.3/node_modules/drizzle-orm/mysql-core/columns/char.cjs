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
  MySqlChar: () => MySqlChar,
  MySqlCharBuilder: () => MySqlCharBuilder,
  char: () => char
});
module.exports = __toCommonJS(char_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlCharBuilder extends import_common.MySqlColumnBuilder {
  static [import_entity.entityKind] = "MySqlCharBuilder";
  constructor(name, config) {
    super(name, "string", "MySqlChar");
    this.config.length = config.length;
    this.config.enum = config.enum;
  }
  /** @internal */
  build(table) {
    return new MySqlChar(
      table,
      this.config
    );
  }
}
class MySqlChar extends import_common.MySqlColumn {
  static [import_entity.entityKind] = "MySqlChar";
  length = this.config.length;
  enumValues = this.config.enum;
  getSQLType() {
    return this.length === void 0 ? `char` : `char(${this.length})`;
  }
}
function char(a, b = {}) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new MySqlCharBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlChar,
  MySqlCharBuilder,
  char
});
//# sourceMappingURL=char.cjs.map