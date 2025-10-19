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
var varchar_exports = {};
__export(varchar_exports, {
  MySqlVarChar: () => MySqlVarChar,
  MySqlVarCharBuilder: () => MySqlVarCharBuilder,
  varchar: () => varchar
});
module.exports = __toCommonJS(varchar_exports);
var import_entity = require("../../entity.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("./common.cjs");
class MySqlVarCharBuilder extends import_common.MySqlColumnBuilder {
  static [import_entity.entityKind] = "MySqlVarCharBuilder";
  /** @internal */
  constructor(name, config) {
    super(name, "string", "MySqlVarChar");
    this.config.length = config.length;
    this.config.enum = config.enum;
  }
  /** @internal */
  build(table) {
    return new MySqlVarChar(
      table,
      this.config
    );
  }
}
class MySqlVarChar extends import_common.MySqlColumn {
  static [import_entity.entityKind] = "MySqlVarChar";
  length = this.config.length;
  enumValues = this.config.enum;
  getSQLType() {
    return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
  }
}
function varchar(a, b) {
  const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
  return new MySqlVarCharBuilder(name, config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlVarChar,
  MySqlVarCharBuilder,
  varchar
});
//# sourceMappingURL=varchar.cjs.map