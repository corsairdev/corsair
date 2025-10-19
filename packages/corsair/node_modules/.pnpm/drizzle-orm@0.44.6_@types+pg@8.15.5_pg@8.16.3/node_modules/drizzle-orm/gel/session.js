import { NoopCache } from "../cache/core/index.js";
import { entityKind } from "../entity.js";
import { GelPreparedQuery, GelSession, GelTransaction } from "../gel-core/session.js";
import { NoopLogger } from "../logger.js";
import { fillPlaceholders } from "../sql/sql.js";
import { tracer } from "../tracing.js";
import { mapResultRow } from "../utils.js";
class GelDbPreparedQuery extends GelPreparedQuery {
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
  static [entityKind] = "GelPreparedQuery";
  async execute(placeholderValues = {}) {
    return tracer.startActiveSpan("drizzle.execute", async () => {
      const params = fillPlaceholders(this.params, placeholderValues);
      this.logger.logQuery(this.queryString, params);
      const { fields, queryString: query, client, joinsNotNullableMap, customResultMapper } = this;
      if (!fields && !customResultMapper) {
        return tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
          span?.setAttributes({
            "drizzle.query.text": query,
            "drizzle.query.params": JSON.stringify(params)
          });
          return await this.queryWithCache(query, params, async () => {
            return await client.querySQL(query, params.length ? params : void 0);
          });
        });
      }
      const result = await tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
        span?.setAttributes({
          "drizzle.query.text": query,
          "drizzle.query.params": JSON.stringify(params)
        });
        return await this.queryWithCache(query, params, async () => {
          return await client.withSQLRowMode("array").querySQL(query, params.length ? params : void 0);
        });
      });
      return tracer.startActiveSpan("drizzle.mapResponse", () => {
        return customResultMapper ? customResultMapper(result) : result.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
      });
    });
  }
  async all(placeholderValues = {}) {
    return await tracer.startActiveSpan("drizzle.execute", async () => {
      const params = fillPlaceholders(this.params, placeholderValues);
      this.logger.logQuery(this.queryString, params);
      return await tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
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
class GelDbSession extends GelSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
    this.cache = options.cache ?? new NoopCache();
  }
  static [entityKind] = "GelDbSession";
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
class GelDbTransaction extends GelTransaction {
  static [entityKind] = "GelDbTransaction";
  async transaction(transaction) {
    const tx = new GelDbTransaction(
      this.dialect,
      this.session,
      this.schema
    );
    return await transaction(tx);
  }
}
export {
  GelDbPreparedQuery,
  GelDbSession,
  GelDbTransaction
};
//# sourceMappingURL=session.js.map