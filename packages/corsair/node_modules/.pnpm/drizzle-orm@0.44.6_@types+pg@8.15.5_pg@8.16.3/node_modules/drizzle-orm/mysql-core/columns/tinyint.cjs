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
var tinyint_exports = {};
__export(tinyint_exports, {
  MySqlTinyInt: () => MySqlTinyInt,
  MySqlTinyIntBuilder: () => MySqlTinyIntBuilder,
  tinyint: () => tinyint
});
module.exports = __toCommonJS(tinyint_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlTinyIntBuilder extends import_common.MySqlColumnBuilderWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlTinyIntBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlTinyInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new MySqlTinyInt(
      table,
      this.config
    );
  }
}
class MySqlTinyInt extends import_common.MySqlColumnWithAutoIncrement {
  static [import_entity.entityKind] = "MySqlTinyInt";
  getSQLType() {
    return `tinyint${this.config.unsigned ? " unsigned" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function tinyint(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new MySqlTinyIntBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlTinyInt,
  MySqlTinyIntBuilder,
  tinyint
});
//# sourceMappingURL=tinyint.cjs.map