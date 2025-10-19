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
var utils_exports = {};
__export(utils_exports, {
  extractUsedTable: () => extractUsedTable,
  getTableConfig: () => getTableConfig
});
module.exports = __toCommonJS(utils_exports);
var import_entity = require("../entity.cjs");
var import_sql = require("../sql/sql.cjs");
var import_subquery = require("../subquery.cjs");
var import_table = require("../table.cjs");
var import_indexes = require("./indexes.cjs");
var import_primary_keys = require("./primary-keys.cjs");
var import_table2 = require("./table.cjs");
var import_unique_constraint = require("./unique-constraint.cjs");
function extractUsedTable(table) {
  if ((0, import_entity.is)(table, import_table2.SingleStoreTable)) {
    return [`${table[import_table.Table.Symbol.BaseName]}`];
  }
  if ((0, import_entity.is)(table, import_subquery.Subquery)) {
    return table._.usedTables ?? [];
  }
  if ((0, import_entity.is)(table, import_sql.SQL)) {
    return table.usedTables ?? [];
  }
  return [];
}
function getTableConfig(table) {
  const columns = Object.values(table[import_table2.SingleStoreTable.Symbol.Columns]);
  const indexes = [];
  const primaryKeys = [];
  const uniqueConstraints = [];
  const name = table[import_table.Table.Symbol.Name];
  const schema = table[import_table.Table.Symbol.Schema];
  const baseName = table[import_table.Table.Symbol.BaseName];
  const extraConfigBuilder = table[import_table2.SingleStoreTable.Symbol.ExtraConfigBuilder];
  if (extraConfigBuilder !== void 0) {
    const extraConfig = extraConfigBuilder(table[import_table2.SingleStoreTable.Symbol.Columns]);
    const extraValues = Array.isArray(extraConfig) ? extraConfig.flat(1) : Object.values(extraConfig);
    for (const builder of Object.values(extraValues)) {
      if ((0, import_entity.is)(builder, import_indexes.IndexBuilder)) {
        indexes.push(builder.build(table));
      } else if ((0, import_entity.is)(builder, import_unique_constraint.UniqueConstraintBuilder)) {
        uniqueConstraints.push(builder.build(table));
      } else if ((0, import_entity.is)(builder, import_primary_keys.PrimaryKeyBuilder)) {
        primaryKeys.push(builder.build(table));
      }
    }
  }
  return {
    columns,
    indexes,
    primaryKeys,
    uniqueConstraints,
    name,
    schema,
    baseName
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extractUsedTable,
  getTableConfig
});
//# sourceMappingURL=utils.cjs.map