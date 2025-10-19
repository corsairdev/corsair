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
var alias_exports = {};
__export(alias_exports, {
  ColumnAliasProxyHandler: () => ColumnAliasProxyHandler,
  RelationTableAliasProxyHandler: () => RelationTableAliasProxyHandler,
  TableAliasProxyHandler: () => TableAliasProxyHandler,
  aliasedRelation: () => aliasedRelation,
  aliasedTable: () => aliasedTable,
  aliasedTableColumn: () => aliasedTableColumn,
  mapColumnsInAliasedSQLToAlias: () => mapColumnsInAliasedSQLToAlias,
  mapColumnsInSQLToAlias: () => mapColumnsInSQLToAlias
});
module.exports = __toCommonJS(alias_exports);
var import_column = require("./column.cjs");
var import_entity = require("./entity.cjs");
var import_sql = require("./sql/sql.cjs");
var import_table = require("./table.cjs");
var import_view_common = require("./view-common.cjs");
class ColumnAliasProxyHandler {
  constructor(table) {
    this.table = table;
  }
  static [import_entity.entityKind] = "ColumnAliasProxyHandler";
  get(columnObj, prop) {
    if (prop === "table") {
      return this.table;
    }
    return columnObj[prop];
  }
}
class TableAliasProxyHandler {
  constructor(alias, replaceOriginalName) {
    this.alias = alias;
    this.replaceOriginalName = replaceOriginalName;
  }
  static [import_entity.entityKind] = "TableAliasProxyHandler";
  get(target, prop) {
    if (prop === import_table.Table.Symbol.IsAlias) {
      return true;
    }
    if (prop === import_table.Table.Symbol.Name) {
      return this.alias;
    }
    if (this.replaceOriginalName && prop === import_table.Table.Symbol.OriginalName) {
      return this.alias;
    }
    if (prop === import_view_common.ViewBaseConfig) {
      return {
        ...target[import_view_common.ViewBaseConfig],
        name: this.alias,
        isAlias: true
      };
    }
    if (prop === import_table.Table.Symbol.Columns) {
      const columns = target[import_table.Table.Symbol.Columns];
      if (!columns) {
        return columns;
      }
      const proxiedColumns = {};
      Object.keys(columns).map((key) => {
        proxiedColumns[key] = new Proxy(
          columns[key],
          new ColumnAliasProxyHandler(new Proxy(target, this))
        );
      });
      return proxiedColumns;
    }
    const value = target[prop];
    if ((0, import_entity.is)(value, import_column.Column)) {
      return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
    }
    return value;
  }
}
class RelationTableAliasProxyHandler {
  constructor(alias) {
    this.alias = alias;
  }
  static [import_entity.entityKind] = "RelationTableAliasProxyHandler";
  get(target, prop) {
    if (prop === "sourceTable") {
      return aliasedTable(target.sourceTable, this.alias);
    }
    return target[prop];
  }
}
function aliasedTable(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
function aliasedRelation(relation, tableAlias) {
  return new Proxy(relation, new RelationTableAliasProxyHandler(tableAlias));
}
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(
    column,
    new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
  );
}
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new import_sql.SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
function mapColumnsInSQLToAlias(query, alias) {
  return import_sql.sql.join(query.queryChunks.map((c) => {
    if ((0, import_entity.is)(c, import_column.Column)) {
      return aliasedTableColumn(c, alias);
    }
    if ((0, import_entity.is)(c, import_sql.SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if ((0, import_entity.is)(c, import_sql.SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ColumnAliasProxyHandler,
  RelationTableAliasProxyHandler,
  TableAliasProxyHandler,
  aliasedRelation,
  aliasedTable,
  aliasedTableColumn,
  mapColumnsInAliasedSQLToAlias,
  mapColumnsInSQLToAlias
});
//# sourceMappingURL=alias.cjs.map