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
  TiDBServerlessPreparedQuery: () => TiDBServerlessPreparedQuery,
  TiDBServerlessSession: () => TiDBServerlessSession,
  TiDBServerlessTransaction: () => TiDBServerlessTransaction
});
module.exports = __toCommonJS(session_exports);
var import_core = require("../cache/core/index.cjs");
var import_column = require("../column.cjs");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_session = require("../mysql-core/session.cjs");
var import_sql = require("../sql/sql.cjs");
var import_utils = require("../utils.cjs");
const executeRawConfig = { fullResult: true };
const queryConfig = { arrayMode: true };
class TiDBServerlessPreparedQuery extends import_session.MySqlPreparedQuery {
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
  static [import_entity.entityKind] = "TiDBPreparedQuery";
  async execute(placeholderValues = {}) {
    const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues);
    this.logger.logQuery(this.queryString, params);
    const { fields, client, queryString, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
    if (!fields && !customResultMapper) {
      const res = await this.queryWithCache(queryString, params, async () => {
        return await client.execute(queryString, params, executeRawConfig);
      });
      const insertId = res.lastInsertId ?? 0;
      const affectedRows = res.rowsAffected ?? 0;
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
      return res;
    }
    const rows = await this.queryWithCache(queryString, params, async () => {
      return await client.execute(queryString, params, queryConfig);
    });
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap));
  }
  iterator(_placeholderValues) {
    throw new Error("Streaming is not supported by the TiDB Cloud Serverless driver");
  }
}
class TiDBServerlessSession extends import_session.MySqlSession {
  constructor(baseClient, dialect, tx, schema, options = {}) {
    super(dialect);
    this.baseClient = baseClient;
    this.schema = schema;
    this.options = options;
    this.client = tx ?? baseClient;
    this.logger = options.logger ?? new import_logger.NoopLogger();
    this.cache = options.cache ?? new import_core.NoopCache();
  }
  static [import_entity.entityKind] = "TiDBServerlessSession";
  logger;
  client;
  cache;
  prepareQuery(query, fields, customResultMapper, generatedIds, returningIds, queryMetadata, cacheConfig) {
    return new TiDBServerlessPreparedQuery(
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
    return this.client.execute(querySql.sql, querySql.params);
  }
  async count(sql2) {
    const res = await this.execute(sql2);
    return Number(
      res["rows"][0]["count"]
    );
  }
  async transaction(transaction) {
    const nativeTx = await this.baseClient.begin();
    try {
      const session = new TiDBServerlessSession(this.baseClient, this.dialect, nativeTx, this.schema, this.options);
      const tx = new TiDBServerlessTransaction(
        this.dialect,
        session,
        this.schema
      );
      const result = await transaction(tx);
      await nativeTx.commit();
      return result;
    } catch (err) {
      await nativeTx.rollback();
      throw err;
    }
  }
}
class TiDBServerlessTransaction extends import_session.MySqlTransaction {
  static [import_entity.entityKind] = "TiDBServerlessTransaction";
  constructor(dialect, session, schema, nestedIndex = 0) {
    super(dialect, session, schema, nestedIndex, "default");
  }
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex + 1}`;
    const tx = new TiDBServerlessTransaction(
      this.dialect,
      this.session,
      this.schema,
      this.nestedIndex + 1
    );
    await tx.execute(import_sql.sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await tx.execute(import_sql.sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      await tx.execute(import_sql.sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TiDBServerlessPreparedQuery,
  TiDBServerlessSession,
  TiDBServerlessTransaction
});
//# sourceMappingURL=session.cjs.map