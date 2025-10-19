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
  BunSQLPreparedQuery: () => BunSQLPreparedQuery,
  BunSQLSession: () => BunSQLSession,
  BunSQLTransaction: () => BunSQLTransaction
});
module.exports = __toCommonJS(session_exports);
var import_core = require("../cache/core/index.cjs");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_pg_core = require("../pg-core/index.cjs");
var import_session = require("../pg-core/session.cjs");
var import_sql = require("../sql/sql.cjs");
var import_tracing = require("../tracing.cjs");
var import_utils = require("../utils.cjs");
class BunSQLPreparedQuery extends import_session.PgPreparedQuery {
  constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper) {
    super({ sql: queryString, params }, cache, queryMetadata, cacheConfig);
    this.client = client;
    this.queryString = queryString;
    this.params = params;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [import_entity.entityKind] = "BunSQLPreparedQuery";
  async execute(placeholderValues = {}) {
    return import_tracing.tracer.startActiveSpan("drizzle.execute", async (span) => {
      const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues);
      span?.setAttributes({
        "drizzle.query.text": this.queryString,
        "drizzle.query.params": JSON.stringify(params)
      });
      this.logger.logQuery(this.queryString, params);
      const { fields, queryString: query, client, joinsNotNullableMap, customResultMapper } = this;
      if (!fields && !customResultMapper) {
        return import_tracing.tracer.startActiveSpan("drizzle.driver.execute", async () => {
          return await this.queryWithCache(query, params, async () => {
            return await client.unsafe(query, params);
          });
        });
      }
      const rows = await import_tracing.tracer.startActiveSpan("drizzle.driver.execute", async () => {
        span?.setAttributes({
          "drizzle.query.text": query,
          "drizzle.query.params": JSON.stringify(params)
        });
        return await this.queryWithCache(query, params, async () => {
          return client.unsafe(query, params).values();
        });
      });
      return import_tracing.tracer.startActiveSpan("drizzle.mapResponse", () => {
        return customResultMapper ? customResultMapper(rows) : rows.map((row) => (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap));
      });
    });
  }
  all(placeholderValues = {}) {
    return import_tracing.tracer.startActiveSpan("drizzle.execute", async (span) => {
      const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues);
      span?.setAttributes({
        "drizzle.query.text": this.queryString,
        "drizzle.query.params": JSON.stringify(params)
      });
      this.logger.logQuery(this.queryString, params);
      return import_tracing.tracer.startActiveSpan("drizzle.driver.execute", async () => {
        span?.setAttributes({
          "drizzle.query.text": this.queryString,
          "drizzle.query.params": JSON.stringify(params)
        });
        return await this.queryWithCache(this.queryString, params, async () => {
          return await this.client.unsafe(this.queryString, params);
        });
      });
    });
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
class BunSQLSession extends import_session.PgSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new import_logger.NoopLogger();
    this.cache = options.cache ?? new import_core.NoopCache();
  }
  static [import_entity.entityKind] = "BunSQLSession";
  logger;
  cache;
  prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    return new BunSQLPreparedQuery(
      this.client,
      query.sql,
      query.params,
      this.logger,
      this.cache,
      queryMetadata,
      cacheConfig,
      fields,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  query(query, params) {
    this.logger.logQuery(query, params);
    return this.client.unsafe(query, params).values();
  }
  queryObjects(query, params) {
    return this.client.unsafe(query, params);
  }
  transaction(transaction, config) {
    return this.client.begin(async (client) => {
      const session = new BunSQLSession(
        client,
        this.dialect,
        this.schema,
        this.options
      );
      const tx = new BunSQLTransaction(this.dialect, session, this.schema);
      if (config) {
        await tx.setTransaction(config);
      }
      return transaction(tx);
    });
  }
}
class BunSQLTransaction extends import_pg_core.PgTransaction {
  constructor(dialect, session, schema, nestedIndex = 0) {
    super(dialect, session, schema, nestedIndex);
    this.session = session;
  }
  static [import_entity.entityKind] = "BunSQLTransaction";
  transaction(transaction) {
    return this.session.client.savepoint((client) => {
      const session = new BunSQLSession(
        client,
        this.dialect,
        this.schema,
        this.session.options
      );
      const tx = new BunSQLTransaction(this.dialect, session, this.schema);
      return transaction(tx);
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BunSQLPreparedQuery,
  BunSQLSession,
  BunSQLTransaction
});
//# sourceMappingURL=session.cjs.map