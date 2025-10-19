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
  GelDbPreparedQuery: () => GelDbPreparedQuery,
  GelDbSession: () => GelDbSession,
  GelDbTransaction: () => GelDbTransaction
});
module.exports = __toCommonJS(session_exports);
var import_core = require("../cache/core/index.cjs");
var import_entity = require("../entity.cjs");
var import_session = require("../gel-core/session.cjs");
var import_logger = require("../logger.cjs");
var import_sql = require("../sql/sql.cjs");
var import_tracing = require("../tracing.cjs");
var import_utils = require("../utils.cjs");
class GelDbPreparedQuery extends import_session.GelPreparedQuery {
  constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper, transaction = false) {
    super({ sql: queryString, params }, cache, queryMetadata, cacheConfig);
    this.client = client;
    this.queryString = queryString;
    this.params = params;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
    this.transaction = transaction;
  }
  static [import_entity.entityKind] = "GelPreparedQuery";
  async execute(placeholderValues = {}) {
    return import_tracing.tracer.startActiveSpan("drizzle.execute", async () => {
      const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues);
      this.logger.logQuery(this.queryString, params);
      const { fields, queryString: query, client, joinsNotNullableMap, customResultMapper } = this;
      if (!fields && !customResultMapper) {
        return import_tracing.tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
          span?.setAttributes({
            "drizzle.query.text": query,
            "drizzle.query.params": JSON.stringify(params)
          });
          return await this.queryWithCache(query, params, async () => {
            return await client.querySQL(query, params.length ? params : void 0);
          });
        });
      }
      const result = await import_tracing.tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
        span?.setAttributes({
          "drizzle.query.text": query,
          "drizzle.query.params": JSON.stringify(params)
        });
        return await this.queryWithCache(query, params, async () => {
          return await client.withSQLRowMode("array").querySQL(query, params.length ? params : void 0);
        });
      });
      return import_tracing.tracer.startActiveSpan("drizzle.mapResponse", () => {
        return customResultMapper ? customResultMapper(result) : result.map((row) => (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap));
      });
    });
  }
  async all(placeholderValues = {}) {
    return await import_tracing.tracer.startActiveSpan("drizzle.execute", async () => {
      const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues);
      this.logger.logQuery(this.queryString, params);
      return await import_tracing.tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
        span?.setAttributes({
          "drizzle.query.text": this.queryString,
          "drizzle.query.params": JSON.stringify(params)
        });
        return await this.queryWithCache(this.queryString, params, async () => {
          return await this.client.withSQLRowMode("array").querySQL(
            this.queryString,
            params.length ? params : void 0
          ).then((result) => result);
        });
      });
    });
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
class GelDbSession extends import_session.GelSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new import_logger.NoopLogger();
    this.cache = options.cache ?? new import_core.NoopCache();
  }
  static [import_entity.entityKind] = "GelDbSession";
  logger;
  cache;
  prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    return new GelDbPreparedQuery(
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
  async transaction(transaction) {
    return await this.client.transaction(async (clientTx) => {
      const session = new GelDbSession(clientTx, this.dialect, this.schema, this.options);
      const tx = new GelDbTransaction(this.dialect, session, this.schema);
      return await transaction(tx);
    });
  }
  async count(sql) {
    const res = await this.execute(sql);
    return Number(res[0]["count"]);
  }
}
class GelDbTransaction extends import_session.GelTransaction {
  static [import_entity.entityKind] = "GelDbTransaction";
  async transaction(transaction) {
    const tx = new GelDbTransaction(
      this.dialect,
      this.session,
      this.schema
    );
    return await transaction(tx);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GelDbPreparedQuery,
  GelDbSession,
  GelDbTransaction
});
//# sourceMappingURL=session.cjs.map