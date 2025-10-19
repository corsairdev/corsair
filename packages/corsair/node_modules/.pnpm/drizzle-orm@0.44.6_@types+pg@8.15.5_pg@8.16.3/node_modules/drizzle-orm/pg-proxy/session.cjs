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
  PgProxyTransaction: () => PgProxyTransaction,
  PgRemoteSession: () => PgRemoteSession,
  PreparedQuery: () => PreparedQuery
});
module.exports = __toCommonJS(session_exports);
var import_cache = require("../cache/core/cache.cjs");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_pg_core = require("../pg-core/index.cjs");
var import_session = require("../pg-core/session.cjs");
var import_sql = require("../sql/sql.cjs");
var import_tracing = require("../tracing.cjs");
var import_utils = require("../utils.cjs");
class PgRemoteSession extends import_session.PgSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new import_logger.NoopLogger();
    this.cache = options.cache ?? new import_cache.NoopCache();
  }
  static [import_entity.entityKind] = "PgRemoteSession";
  logger;
  cache;
  prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    return new PreparedQuery(
      this.client,
      query.sql,
      query.params,
      query.typings,
      this.logger,
      this.cache,
      queryMetadata,
      cacheConfig,
      fields,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  async transaction(_transaction, _config) {
    throw new Error("Transactions are not supported by the Postgres Proxy driver");
  }
}
class PgProxyTransaction extends import_pg_core.PgTransaction {
  static [import_entity.entityKind] = "PgProxyTransaction";
  async transaction(_transaction) {
    throw new Error("Transactions are not supported by the Postgres Proxy driver");
  }
}
class PreparedQuery extends import_session.PgPreparedQuery {
  constructor(client, queryString, params, typings, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper) {
    super({ sql: queryString, params }, cache, queryMetadata, cacheConfig);
    this.client = client;
    this.queryString = queryString;
    this.params = params;
    this.typings = typings;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [import_entity.entityKind] = "PgProxyPreparedQuery";
  async execute(placeholderValues = {}) {
    return import_tracing.tracer.startActiveSpan("drizzle.execute", async (span) => {
      const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues);
      const { fields, client, queryString, joinsNotNullableMap, customResultMapper, logger, typings } = this;
      span?.setAttributes({
        "drizzle.query.text": queryString,
        "drizzle.query.params": JSON.stringify(params)
      });
      logger.logQuery(queryString, params);
      if (!fields && !customResultMapper) {
        return import_tracing.tracer.startActiveSpan("drizzle.driver.execute", async () => {
          const { rows: rows2 } = await this.queryWithCache(queryString, params, async () => {
            return await client(queryString, params, "execute", typings);
          });
          return rows2;
        });
      }
      const rows = await import_tracing.tracer.startActiveSpan("drizzle.driver.execute", async () => {
        span?.setAttributes({
          "drizzle.query.text": queryString,
          "drizzle.query.params": JSON.stringify(params)
        });
        const { rows: rows2 } = await this.queryWithCache(queryString, params, async () => {
          return await client(queryString, params, "all", typings);
        });
        return rows2;
      });
      return import_tracing.tracer.startActiveSpan("drizzle.mapResponse", () => {
        return customResultMapper ? customResultMapper(rows) : rows.map((row) => (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap));
      });
    });
  }
  async all() {
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgProxyTransaction,
  PgRemoteSession,
  PreparedQuery
});
//# sourceMappingURL=session.cjs.map