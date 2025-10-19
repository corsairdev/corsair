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
var text_exports = {};
__export(text_exports, {
  MySqlText: () => MySqlText,
  MySqlTextBuilder: () => MySqlTextBuilder,
  longtext: () => longtext,
  mediumtext: () => mediumtext,
  text: () => text,
  tinytext: () => tinytext
});
module.exports = __toCommonJS(text_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlTextBuilder extends import_common.MySqlColumnBuilder {
  static [import_entity.entityKind] = "MySqlTextBuilder";
  constructor(name, textType, config) {
    super(name, "string", "MySqlText");
    this.config.textType = textType;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new MySqlText(table, this.config);
  }
}
class MySqlText extends import_common.MySqlColumn {
  static [import_entity.entityKind] = "MySqlText";
  textType = this.config.textType;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.textType;
  }
}
function text(a, b = {}) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new MySqlTextBuilder(name, "text", config);
}
function tinytext(a, b = {}) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new MySqlTextBuilder(name, "tinytext", config);
}
function mediumtext(a, b = {}) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new MySqlTextBuilder(name, "mediumtext", config);
}
function longtext(a, b = {}) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new MySqlTextBuilder(name, "longtext", config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlText,
  MySqlTextBuilder,
  longtext,
  mediumtext,
  text,
  tinytext
});
//# sourceMappingURL=text.cjs.map