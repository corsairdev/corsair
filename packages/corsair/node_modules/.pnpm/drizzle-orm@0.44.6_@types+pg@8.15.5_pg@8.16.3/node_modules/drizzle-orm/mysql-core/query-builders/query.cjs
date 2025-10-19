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
var query_exports = {};
__export(query_exports, {
  MySqlRelationalQuery: () => MySqlRelationalQuery,
  RelationalQueryBuilder: () => RelationalQueryBuilder
});
module.exports = __toCommonJS(query_exports);
var import_entity = require("../../entity.cjs");
var import_query_promise = require("../../query-promise.cjs");
var import_relations = require("../../relations.cjs");
class RelationalQueryBuilder {
  constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, mode) {
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.mode = mode;
  }
  static [import_entity.entityKind] = "MySqlRelationalQueryBuilder";
  findMany(config) {
    return new MySqlRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? config : {},
      "many",
      this.mode
    );
  }
  findFirst(config) {
    return new MySqlRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? { ...config, limit: 1 } : { limit: 1 },
      "first",
      this.mode
    );
  }
}
class MySqlRelationalQuery extends import_query_promise.QueryPromise {
  constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config, queryMode, mode) {
    super();
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.config = config;
    this.queryMode = queryMode;
    this.mode = mode;
  }
  static [import_entity.entityKind] = "MySqlRelationalQuery";
  prepare() {
    const { query, builtQuery } = this._toSQL();
    return this.session.prepareQuery(
      builtQuery,
      void 0,
      (rawRows) => {
        const rows = rawRows.map((row) => (0, import_relations.mapRelationalRow)(this.schema, this.tableConfig, row, query.selection));
        if (this.queryMode === "first") {
          return rows[0];
        }
        return rows;
      }
    );
  }
  _getQuery() {
    const query = this.mode === "planetscale" ? this.dialect.buildRelationalQueryWithoutLateralSubqueries({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }) : this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    });
    return query;
  }
  _toSQL() {
    const query = this._getQuery();
    const builtQuery = this.dialect.sqlToQuery(query.sql);
    return { builtQuery, query };
  }
  /** @internal */
  getSQL() {
    return this._getQuery().sql;
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  execute() {
    return this.prepare().execute();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlRelationalQuery,
  RelationalQueryBuilder
});
//# sourceMappingURL=query.cjs.map