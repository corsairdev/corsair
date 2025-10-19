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
var table_exports = {};
__export(table_exports, {
  EnableRLS: () => EnableRLS,
  InlineForeignKeys: () => InlineForeignKeys,
  PgTable: () => PgTable,
  pgTable: () => pgTable,
  pgTableCreator: () => pgTableCreator,
  pgTableWithSchema: () => pgTableWithSchema
});
module.exports = __toCommonJS(table_exports);
var import_entity = require("../entity.cjs");
var import_table = require("../table.cjs");
var import_all = require("./columns/all.cjs");
const InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
const EnableRLS = Symbol.for("drizzle:EnableRLS");
class PgTable extends import_table.Table {
  static [import_entity.entityKind] = "PgTable";
  /** @internal */
  static Symbol = Object.assign({}, import_table.Table.Symbol, {
    InlineForeignKeys,
    EnableRLS
  });
  /**@internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [EnableRLS] = false;
  /** @internal */
  [import_table.Table.Symbol.ExtraConfigBuilder] = void 0;
  /** @internal */
  [import_table.Table.Symbol.ExtraConfigColumns] = {};
}
function pgTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new PgTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns((0, import_all.getPgColumnBuilders)()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const builtColumnsForExtraConfig = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.buildExtraConfigColumn(rawTable);
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[import_table.Table.Symbol.Columns] = builtColumns;
  table[import_table.Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
  if (extraConfig) {
    table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return Object.assign(table, {
    enableRLS: () => {
      table[PgTable.Symbol.EnableRLS] = true;
      return table;
    }
  });
}
const pgTable = (name, columns, extraConfig) => {
  return pgTableWithSchema(name, columns, extraConfig, void 0);
};
function pgTableCreator(customizeTableName) {
  return (name, columns, extraConfig) => {
    return pgTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EnableRLS,
  InlineForeignKeys,
  PgTable,
  pgTable,
  pgTableCreator,
  pgTableWithSchema
});
//# sourceMappingURL=table.cjs.map