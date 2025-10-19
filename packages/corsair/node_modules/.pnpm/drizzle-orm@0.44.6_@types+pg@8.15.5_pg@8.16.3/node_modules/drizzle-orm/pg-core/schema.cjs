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
  PgSchema: () => PgSchema,
  isPgSchema: () => isPgSchema,
  pgSchema: () => pgSchema
});
module.exports = __toCommonJS(schema_exports);
var import_entity = require("../entity.cjs");
var import_sql = require("../sql/sql.cjs");
var import_enum = require("./columns/enum.cjs");
var import_sequence = require("./sequence.cjs");
var import_table = require("./table.cjs");
var import_view = require("./view.cjs");
class PgSchema {
  constructor(schemaName) {
    this.schemaName = schemaName;
  }
  static [import_entity.entityKind] = "PgSchema";
  table = (name, columns, extraConfig) => {
    return (0, import_table.pgTableWithSchema)(name, columns, extraConfig, this.schemaName);
  };
  view = (name, columns) => {
    return (0, import_view.pgViewWithSchema)(name, columns, this.schemaName);
  };
  materializedView = (name, columns) => {
    return (0, import_view.pgMaterializedViewWithSchema)(name, columns, this.schemaName);
  };
  enum(enumName, input) {
    return Array.isArray(input) ? (0, import_enum.pgEnumWithSchema)(
      enumName,
      [...input],
      this.schemaName
    ) : (0, import_enum.pgEnumObjectWithSchema)(enumName, input, this.schemaName);
  }
  sequence = (name, options) => {
    return (0, import_sequence.pgSequenceWithSchema)(name, options, this.schemaName);
  };
  getSQL() {
    return new import_sql.SQL([import_sql.sql.identifier(this.schemaName)]);
  }
  shouldOmitSQLParens() {
    return true;
  }
}
function isPgSchema(obj) {
  return (0, import_entity.is)(obj, PgSchema);
}
function pgSchema(name) {
  if (name === "public") {
    throw new Error(
      `You can't specify 'public' as schema name. Postgres is using public schema by default. If you want to use 'public' schema, just use pgTable() instead of creating a schema`
    );
  }
  return new PgSchema(name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgSchema,
  isPgSchema,
  pgSchema
});
//# sourceMappingURL=schema.cjs.map