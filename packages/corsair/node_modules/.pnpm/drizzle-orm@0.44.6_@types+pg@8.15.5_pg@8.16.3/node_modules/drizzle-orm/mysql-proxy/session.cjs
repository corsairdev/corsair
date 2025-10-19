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
var session_exports = {};
__export(session_exports, {
  MySqlProxyTransaction: () => MySqlProxyTransaction,
  MySqlRemoteSession: () => MySqlRemoteSession,
  PreparedQuery: () => PreparedQuery
});
module.exports = __toCommonJS(session_exports);
var import_core = require("../cache/core/index.cjs");
var import_column = require("../column.cjs");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_mysql_core = require("../mysql-core/index.cjs");
var import_session = require("../mysql-core/session.cjs");
var import_sql = require("../sql/sql.cjs");
var import_utils = require("../utils.cjs");
class MySqlRemoteSession extends import_session.MySqlSession {
  constructor(client, dialect, schema, options) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new import_logger.NoopLogger();
    this.cache = options.cache ?? new import_core.NoopCache();
  }
  static [import_entity.entityKind] = "MySqlRemoteSession";
  logger;
  cache;
  prepareQuery(query, fields, customResultMapper, generatedIds, returningIds, queryMetadata, cacheConfig) {
    return new PreparedQuery(
      this.client,
      query.sql,
      query.params,
      this.logger,
      this.cache,
      queryMetadata,
      cacheConfig,
      fields,
      customResultMapper,
      generatedIds,
      returningIds
    );
  }
  all(query) {
    const querySql = this.dialect.sqlToQuery(query);
    this.logger.logQuery(querySql.sql, querySql.params);
    return this.client(querySql.sql, querySql.params, "all").then(({ rows }) => rows);
  }
  async transaction(_transaction, _config) {
    throw new Error("Transactions are not supported by the MySql Proxy driver");
  }
}
class MySqlProxyTransaction extends import_mysql_core.MySqlTransaction {
  static [import_entity.entityKind] = "MySqlProxyTransaction";
  async transaction(_transaction) {
    throw new Error("Transactions are not supported by the MySql Proxy driver");
  }
}
class PreparedQuery extends import_session.MySqlPreparedQuery {
  constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, customResultMapper, generatedIds, returningIds) {
    super(cache, queryMetadata, cacheConfig);
    this.client = client;
    this.queryString = queryString;
    this.params = params;
    this.logger = logger;
    this.fields = fields;
    this.customResultMapper = customResultMapper;
    this.generatedIds = generatedIds;
    this.returningIds = returningIds;
  }
  static [import_entity.entityKind] = "MySqlProxyPreparedQuery";
  async execute(placeholderValues = {}) {
    const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues);
    const { fields, client, queryString, logger, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
    logger.logQuery(queryString, params);
    if (!fields && !customResultMapper) {
      const { rows: data } = await this.queryWithCache(queryString, params, async () => {
        return await client(queryString, params, "execute");
      });
      const insertId = data[0].insertId;
      const affectedRows = data[0].affectedRows;
      if (returningIds) {
        const returningResponse = [];
        let j = 0;
        for (let i = insertId; i < insertId + affectedRows; i++) {
          for (const column of returningIds) {
            const key = returningIds[0].path[0];
            if ((0, import_entity.is)(column.field, import_column.Column)) {
              if (column.field.primary && column.field.autoIncrement) {
                returningResponse.push({ [key]: i });
              }
              if (column.field.defaultFn && generatedIds) {
                returningResponse.push({ [key]: generatedIds[j][key] });
              }
            }
          }
          j++;
        }
        return returningResponse;
      }
      return data;
    }
    const { rows } = await this.queryWithCache(queryString, params, async () => {
      return await client(queryString, params, "all");
    });
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap));
  }
  iterator(_placeholderValues = {}) {
    throw new Error("Streaming is not supported by the MySql Proxy driver");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MySqlProxyTransaction,
  MySqlRemoteSession,
  PreparedQuery
});
//# sourceMappingURL=session.cjs.map