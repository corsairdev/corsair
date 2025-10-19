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
  GelSchema: () => GelSchema,
  gelSchema: () => gelSchema,
  isGelSchema: () => isGelSchema
});
module.exports = __toCommonJS(schema_exports);
var import_entity = require("../entity.cjs");
var import_sql = require("../sql/sql.cjs");
var import_sequence = require("./sequence.cjs");
var import_table = require("./table.cjs");
class GelSchema {
  constructor(schemaName) {
    this.schemaName = schemaName;
  }
  static [import_entity.entityKind] = "GelSchema";
  table = (name, columns, extraConfig) => {
    return (0, import_table.gelTableWithSchema)(name, columns, extraConfig, this.schemaName);
  };
  // view = ((name, columns) => {
  // 	return gelViewWithSchema(name, columns, this.schemaName);
  // }) as typeof gelView;
  // materializedView = ((name, columns) => {
  // 	return gelMaterializedViewWithSchema(name, columns, this.schemaName);
  // }) as typeof gelMaterializedView;
  // enum: typeof gelEnum = ((name, values) => {
  // 	return gelEnumWithSchema(name, values, this.schemaName);
  // });
  sequence = (name, options) => {
    return (0, import_sequence.gelSequenceWithSchema)(name, options, this.schemaName);
  };
  getSQL() {
    return new import_sql.SQL([import_sql.sql.identifier(this.schemaName)]);
  }
  shouldOmitSQLParens() {
    return true;
  }
}
function isGelSchema(obj) {
  return (0, import_entity.is)(obj, GelSchema);
}
function gelSchema(name) {
  if (name === "public") {
    throw new Error(
      `You can't specify 'public' as schema name. Postgres is using public schema by default. If you want to use 'public' schema, just use GelTable() instead of creating a schema`
    );
  }
  return new GelSchema(name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelSchema,
  gelSchema,
  isGelSchema
});
//# sourceMappingURL=schema.cjs.map