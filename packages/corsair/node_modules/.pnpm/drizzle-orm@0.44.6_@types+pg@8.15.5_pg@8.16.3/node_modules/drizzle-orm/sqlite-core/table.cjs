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
  InlineForeignKeys: () => InlineForeignKeys,
  SQLiteTable: () => SQLiteTable,
  sqliteTable: () => sqliteTable,
  sqliteTableCreator: () => sqliteTableCreator
});
module.exports = __toCommonJS(table_exports);
var import_entity = require("../entity.cjs");
var import_table = require("../table.cjs");
var import_all = require("./columns/all.cjs");
const InlineForeignKeys = Symbol.for("drizzle:SQLiteInlineForeignKeys");
class SQLiteTable extends import_table.Table {
  static [import_entity.entityKind] = "SQLiteTable";
  /** @internal */
  static Symbol = Object.assign({}, import_table.Table.Symbol, {
    InlineForeignKeys
  });
  /** @internal */
  [import_table.Table.Symbol.Columns];
  /** @internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [import_table.Table.Symbol.ExtraConfigBuilder] = void 0;
}
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new SQLiteTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns((0, import_all.getSQLiteColumnBuilders)()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[import_table.Table.Symbol.Columns] = builtColumns;
  table[import_table.Table.Symbol.ExtraConfigColumns] = builtColumns;
  if (extraConfig) {
    table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
}
const sqliteTable = (name, columns, extraConfig) => {
  return sqliteTableBase(name, columns, extraConfig);
};
function sqliteTableCreator(customizeTableName) {
  return (name, columns, extraConfig) => {
    return sqliteTableBase(customizeTableName(name), columns, extraConfig, void 0, name);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InlineForeignKeys,
  SQLiteTable,
  sqliteTable,
  sqliteTableCreator
});
//# sourceMappingURL=table.cjs.map