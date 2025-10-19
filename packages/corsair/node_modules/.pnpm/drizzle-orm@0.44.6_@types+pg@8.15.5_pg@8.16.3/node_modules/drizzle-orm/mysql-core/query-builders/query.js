import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";
import {
  mapRelationalRow
} from "../../relations.js";
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
  static [entityKind] = "MySqlRelationalQueryBuilder";
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
class MySqlRelationalQuery extends QueryPromise {
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
  static [entityKind] = "MySqlRelationalQuery";
  prepare() {
    const { query, builtQuery } = this._toSQL();
    return this.session.prepareQuery(
      builtQuery,
      void 0,
      (rawRows) => {
        const rows = rawRows.map((row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection));
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
export {
  MySqlRelationalQuery,
  RelationalQueryBuilder
};
//# sourceMappingURL=query.js.map