import { NoopCache } from "../cache/core/index.js";
import { entityKind } from "../entity.js";
import { NoopLogger } from "../logger.js";
import { fillPlaceholders, sql } from "../sql/sql.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import {
  SQLitePreparedQuery,
  SQLiteSession
} from "../sqlite-core/session.js";
import { mapResultRow } from "../utils.js";
class OPSQLiteSession extends SQLiteSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new NoopLogger();
    this.cache = options.cache ?? new NoopCache();
  }
  static [entityKind] = "OPSQLiteSession";
  logger;
  cache;
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    return new OPSQLitePreparedQuery(
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
  transaction(transaction, config = {}) {
    const tx = new OPSQLiteTransaction("async", this.dialect, this, this.schema);
    this.run(sql.raw(`begin${config?.behavior ? " " + config.behavior : ""}`));
    try {
      const result = transaction(tx);
      this.run(sql`commit`);
      return result;
    } catch (err) {
      this.run(sql`rollback`);
      throw err;
    }
  }
}
class OPSQLiteTransaction extends SQLiteTransaction {
  static [entityKind] = "OPSQLiteTransaction";
  transaction(transaction) {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new OPSQLiteTransaction("async", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.run(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = transaction(tx);
      this.session.run(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
}
class OPSQLitePreparedQuery extends SQLitePreparedQuery {
  constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("sync", executeMethod, query, cache, queryMetadata, cacheConfig);
    this.client = client;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [entityKind] = "OPSQLitePreparedQuery";
  async run(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return await this.queryWithCache(this.query.sql, params, async () => {
      return this.client.executeAsync(this.query.sql, params);
    });
  }
  async all(placeholderValues) {
    const { fields, joinsNotNullableMap, query, logger, customResultMapper, client } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return await this.queryWithCache(query.sql, params, async () => {
        return client.execute(query.sql, params).rows?._array || [];
      });
    }
    const rows = await this.values(placeholderValues);
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
  }
  async get(placeholderValues) {
    const { fields, joinsNotNullableMap, customResultMapper, query, logger, client } = this;
    const params = fillPlaceholders(query.params, placeholderValues ?? {});
    logger.logQuery(query.sql, params);
    if (!fields && !customResultMapper) {
      const rows2 = await this.queryWithCache(query.sql, params, async () => {
        return client.execute(query.sql, params).rows?._array || [];
      });
      return rows2[0];
    }
    const rows = await this.values(placeholderValues);
    const row = rows[0];
    if (!row) {
      return void 0;
    }
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return mapResultRow(fields, row, joinsNotNullableMap);
  }
  async values(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return await this.queryWithCache(this.query.sql, params, async () => {
      return await this.client.executeRawAsync(this.query.sql, params);
    });
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
export {
  OPSQLitePreparedQuery,
  OPSQLiteSession,
  OPSQLiteTransaction
};
//# sourceMappingURL=session.js.map