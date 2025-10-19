import { NoopCache } from "../cache/core/cache.js";
import { entityKind } from "../entity.js";
import { NoopLogger } from "../logger.js";
import { PgTransaction } from "../pg-core/index.js";
import { PgPreparedQuery as PreparedQueryBase, PgSession } from "../pg-core/session.js";
import { fillPlaceholders } from "../sql/sql.js";
import { tracer } from "../tracing.js";
import { mapResultRow } from "../utils.js";
class PgRemoteSession extends PgSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new NoopLogger();
    this.cache = options.cache ?? new NoopCache();
  }
  static [entityKind] = "PgRemoteSession";
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
class PgProxyTransaction extends PgTransaction {
  static [entityKind] = "PgProxyTransaction";
  async transaction(_transaction) {
    throw new Error("Transactions are not supported by the Postgres Proxy driver");
  }
}
class PreparedQuery extends PreparedQueryBase {
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
  static [entityKind] = "PgProxyPreparedQuery";
  async execute(placeholderValues = {}) {
    return tracer.startActiveSpan("drizzle.execute", async (span) => {
      const params = fillPlaceholders(this.params, placeholderValues);
      const { fields, client, queryString, joinsNotNullableMap, customResultMapper, logger, typings } = this;
      span?.setAttributes({
        "drizzle.query.text": queryString,
        "drizzle.query.params": JSON.stringify(params)
      });
      logger.logQuery(queryString, params);
      if (!fields && !customResultMapper) {
        return tracer.startActiveSpan("drizzle.driver.execute", async () => {
          const { rows: rows2 } = await this.queryWithCache(queryString, params, async () => {
            return await client(queryString, params, "execute", typings);
          });
          return rows2;
        });
      }
      const rows = await tracer.startActiveSpan("drizzle.driver.execute", async () => {
        span?.setAttributes({
          "drizzle.query.text": queryString,
          "drizzle.query.params": JSON.stringify(params)
        });
        const { rows: rows2 } = await this.queryWithCache(queryString, params, async () => {
          return await client(queryString, params, "all", typings);
        });
        return rows2;
      });
      return tracer.startActiveSpan("drizzle.mapResponse", () => {
        return customResultMapper ? customResultMapper(rows) : rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
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
export {
  PgProxyTransaction,
  PgRemoteSession,
  PreparedQuery
};
//# sourceMappingURL=session.js.map