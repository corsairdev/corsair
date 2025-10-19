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
  MySqlTable: () => MySqlTable,
  mysqlTable: () => mysqlTable,
  mysqlTableCreator: () => mysqlTableCreator,
  mysqlTableWithSchema: () => mysqlTableWithSchema
});
module.exports = __toCommonJS(table_exports);
var import_entity = require("../entity.cjs");
var import_table = require("../table.cjs");
var import_all = require("./columns/all.cjs");
const InlineForeignKeys = Symbol.for("drizzle:MySqlInlineForeignKeys");
class MySqlTable extends import_table.Table {
  static [import_entity.entityKind] = "MySqlTable";
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
function mysqlTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new MySqlTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns((0, import_all.getMySqlColumnBuilders)()) : columns;
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
    table[MySqlTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
}
const mysqlTable = (name, columns, extraConfig) => {
  return mysqlTableWithSchema(name, columns, extraConfig, void 0, name);
};
function mysqlTableCreator(customizeTableName) {
  return (name, columns, extraConfig) => {
    return mysqlTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InlineForeignKeys,
  MySqlTable,
  mysqlTable,
  mysqlTableCreator,
  mysqlTableWithSchema
});
//# sourceMappingURL=table.cjs.map