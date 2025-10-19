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
  RemotePreparedQuery: () => RemotePreparedQuery,
  SQLiteProxyTransaction: () => SQLiteProxyTransaction,
  SQLiteRemoteSession: () => SQLiteRemoteSession
});
module.exports = __toCommonJS(session_exports);
var import_core = require("../cache/core/index.cjs");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_sql = require("../sql/sql.cjs");
var import_sqlite_core = require("../sqlite-core/index.cjs");
var import_session = require("../sqlite-core/session.cjs");
var import_utils = require("../utils.cjs");
class SQLiteRemoteSession extends import_session.SQLiteSession {
  constructor(client, dialect, schema, batchCLient, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.batchCLient = batchCLient;
    this.logger = options.logger ?? new import_logger.NoopLogger();
    this.cache = options.cache ?? new import_core.NoopCache();
  }
  static [import_entity.entityKind] = "SQLiteRemoteSession";
  logger;
  cache;
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    return new RemotePreparedQuery(
      this.client,
      query,
      this.logger,
      this.cache,
      queryMetadata,
      cacheConfig,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  async batch(queries) {
    const preparedQueries = [];
    const builtQueries = [];
    for (const query of queries) {
      const preparedQuery = query._prepare();
      const builtQuery = preparedQuery.getQuery();
      preparedQueries.push(preparedQuery);
      builtQueries.push({ sql: builtQuery.sql, params: builtQuery.params, method: builtQuery.method });
    }
    const batchResults = await this.batchCLient(builtQueries);
    return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
  }
  async transaction(transaction, config) {
    const tx = new SQLiteProxyTransaction("async", this.dialect, this, this.schema);
    await this.run(import_sql.sql.raw(`begin${config?.behavior ? " " + config.behavior : ""}`));
    try {
      const result = await transaction(tx);
      await this.run(import_sql.sql`commit`);
      return result;
    } catch (err) {
      await this.run(import_sql.sql`rollback`);
      throw err;
    }
  }
  extractRawAllValueFromBatchResult(result) {
    return result.rows;
  }
  extractRawGetValueFromBatchResult(result) {
    return result.rows[0];
  }
  extractRawValuesValueFromBatchResult(result) {
    return result.rows;
  }
}
class SQLiteProxyTransaction extends import_sqlite_core.SQLiteTransaction {
  static [import_entity.entityKind] = "SQLiteProxyTransaction";
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new SQLiteProxyTransaction("async", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    await this.session.run(import_sql.sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await this.session.run(import_sql.sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      await this.session.run(import_sql.sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
}
class RemotePreparedQuery extends import_session.SQLitePreparedQuery {
  constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("async", executeMethod, query, cache, queryMetadata, cacheConfig);
    this.client = client;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
    this.customResultMapper = customResultMapper;
    this.method = executeMethod;
  }
  static [import_entity.entityKind] = "SQLiteProxyPreparedQuery";
  method;
  getQuery() {
    return { ...this.query, method: this.method };
  }
  async run(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return await this.queryWithCache(this.query.sql, params, async () => {
      return await this.client(this.query.sql, params, "run");
    });
  }
  mapAllResult(rows, isFromBatch) {
    if (isFromBatch) {
      rows = rows.rows;
    }
    if (!this.fields && !this.customResultMapper) {
      return rows;
    }
    if (this.customResultMapper) {
      return this.customResultMapper(rows);
    }
    return rows.map((row) => {
      return (0, import_utils.mapResultRow)(
        this.fields,
        row,
        this.joinsNotNullableMap
      );
    });
  }
  async all(placeholderValues) {
    const { query, logger, client } = this;
    const params = (0, import_sql.fillPlaceholders)(query.params, placeholderValues ?? {});
    logger.logQuery(query.sql, params);
    const { rows } = await this.queryWithCache(query.sql, params, async () => {
      return await client(query.sql, params, "all");
    });
    return this.mapAllResult(rows);
  }
  async get(placeholderValues) {
    const { query, logger, client } = this;
    const params = (0, import_sql.fillPlaceholders)(query.params, placeholderValues ?? {});
    logger.logQuery(query.sql, params);
    const clientResult = await this.queryWithCache(query.sql, params, async () => {
      return await client(query.sql, params, "get");
    });
    return this.mapGetResult(clientResult.rows);
  }
  mapGetResult(rows, isFromBatch) {
    if (isFromBatch) {
      rows = rows.rows;
    }
    const row = rows;
    if (!this.fields && !this.customResultMapper) {
      return row;
    }
    if (!row) {
      return void 0;
    }
    if (this.customResultMapper) {
      return this.customResultMapper([rows]);
    }
    return (0, import_utils.mapResultRow)(
      this.fields,
      row,
      this.joinsNotNullableMap
    );
  }
  async values(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    const clientResult = await this.queryWithCache(this.query.sql, params, async () => {
      return await this.client(this.query.sql, params, "values");
    });
    return clientResult.rows;
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RemotePreparedQuery,
  SQLiteProxyTransaction,
  SQLiteRemoteSession
});
//# sourceMappingURL=session.cjs.map