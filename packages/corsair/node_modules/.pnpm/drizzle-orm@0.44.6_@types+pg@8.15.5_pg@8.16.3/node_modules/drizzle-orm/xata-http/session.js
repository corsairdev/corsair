import { NoopCache } from "../cache/core/index.js";
import { entityKind } from "../entity.js";
import { NoopLogger } from "../logger.js";
import { PgTransaction } from "../pg-core/index.js";
import { PgPreparedQuery, PgSession } from "../pg-core/session.js";
import { fillPlaceholders } from "../sql/sql.js";
import { mapResultRow } from "../utils.js";
class XataHttpPreparedQuery extends PgPreparedQuery {
  constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper) {
    super(query, cache, queryMetadata, cacheConfig);
    this.client = client;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [entityKind] = "XataHttpPreparedQuery";
  async execute(placeholderValues = {}) {
    const params = fillPlaceholders(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    const { fields, client, query, customResultMapper, joinsNotNullableMap } = this;
    if (!fields && !customResultMapper) {
      return this.queryWithCache(query.sql, params, async () => {
        return await client.sql({ statement: query.sql, params });
      });
    }
    const { rows, warning } = await this.queryWithCache(query.sql, params, async () => {
      return await client.sql({ statement: query.sql, params, responseType: "array" });
    });
    if (warning) console.warn(warning);
    return customResultMapper ? customResultMapper(rows) : rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
  }
  all(placeholderValues = {}) {
    const params = fillPlaceholders(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    return this.queryWithCache(this.query.sql, params, async () => {
      return this.client.sql({ statement: this.query.sql, params, responseType: "array" });
    }).then((result) => result.rows);
  }
  values(placeholderValues = {}) {
    const params = fillPlaceholders(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    return this.queryWithCache(this.query.sql, params, async () => {
      return this.client.sql({ statement: this.query.sql, params });
    }).then((result) => result.records);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
class XataHttpSession extends PgSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
    this.cache = options.cache ?? new NoopCache();
  }
  static [entityKind] = "XataHttpSession";
  logger;
  cache;
  prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    return new XataHttpPreparedQuery(
      this.client,
      query,
      this.logger,
      this.cache,
      queryMetadata,
      cacheConfig,
      fields,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  async query(query, params) {
    this.logger.logQuery(query, params);
    const result = await this.client.sql({ statement: query, params, responseType: "array" });
    return {
      rowCount: result.rows.length,
      rows: result.rows,
      rowAsArray: true
    };
  }
  async queryObjects(query, params) {
    const result = await this.client.sql({ statement: query, params });
    return {
      rowCount: result.records.length,
      rows: result.records,
      rowAsArray: false
    };
  }
  async transaction(_transaction, _config = {}) {
    throw new Error("No transactions support in Xata Http driver");
  }
}
class XataTransaction extends PgTransaction {
  static [entityKind] = "XataHttpTransaction";
  async transaction(_transaction) {
    throw new Error("No transactions support in Xata Http driver");
  }
}
export {
  XataHttpPreparedQuery,
  XataHttpSession,
  XataTransaction
};
//# sourceMappingURL=session.js.map