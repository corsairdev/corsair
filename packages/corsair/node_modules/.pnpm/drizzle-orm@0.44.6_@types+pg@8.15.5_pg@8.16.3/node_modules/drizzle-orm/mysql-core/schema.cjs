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
var schema_exports = {};
__export(schema_exports, {
  MySqlSchema: () => MySqlSchema,
  isMySqlSchema: () => isMySqlSchema,
  mysqlDatabase: () => mysqlDatabase,
  mysqlSchema: () => mysqlSchema
});
module.exports = __toCommonJS(schema_exports);
var import_entity = require("../entity.cjs");
var import_table = require("./table.cjs");
var import_view = require("./view.cjs");
class MySqlSchema {
  constructor(schemaName) {
    this.schemaName = schemaName;
  }
  static [import_entity.entityKind] = "MySqlSchema";
  table = (name, columns, extraConfig) => {
    return (0, import_table.mysqlTableWithSchema)(name, columns, extraConfig, this.schemaName);
  };
  view = (name, columns) => {
    return (0, import_view.mysqlViewWithSchema)(name, columns, this.schemaName);
  };
}
function isMySqlSchema(obj) {
  return (0, import_entity.is)(obj, MySqlSchema);
}
function mysqlDatabase(name) {
  return new MySqlSchema(name);
}
const mysqlSchema = mysqlDatabase;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlSchema,
  isMySqlSchema,
  mysqlDatabase,
  mysqlSchema
});
//# sourceMappingURL=schema.cjs.map