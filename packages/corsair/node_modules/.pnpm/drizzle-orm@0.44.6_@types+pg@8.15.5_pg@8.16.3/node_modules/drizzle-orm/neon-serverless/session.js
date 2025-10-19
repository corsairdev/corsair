import {
  Pool,
  types
} from "@neondatabase/serverless";
import { NoopCache } from "../cache/core/cache.js";
import { entityKind } from "../entity.js";
import { NoopLogger } from "../logger.js";
import { PgTransaction } from "../pg-core/index.js";
import { PgPreparedQuery, PgSession } from "../pg-core/session.js";
import { fillPlaceholders, sql } from "../sql/sql.js";
import { mapResultRow } from "../utils.js";
class NeonPreparedQuery extends PgPreparedQuery {
  constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, name, _isResponseInArrayMode, customResultMapper) {
    super({ sql: queryString, params }, cache, queryMetadata, cacheConfig);
    this.client = client;
    this.params = params;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
    this.rawQueryConfig = {
      name,
      text: queryString,
      types: {
        // @ts-ignore
        getTypeParser: (typeId, format) => {
          if (typeId === types.builtins.TIMESTAMPTZ) {
            return (val) => val;
          }
          if (typeId === types.builtins.TIMESTAMP) {
            return (val) => val;
          }
          if (typeId === types.builtins.DATE) {
            return (val) => val;
          }
          if (typeId === types.builtins.INTERVAL) {
            return (val) => val;
          }
          if (typeId === 1231) {
            return (val) => val;
          }
          if (typeId === 1115) {
            return (val) => val;
          }
          if (typeId === 1185) {
            return (val) => val;
          }
          if (typeId === 1187) {
            return (val) => val;
          }
          if (typeId === 1182) {
            return (val) => val;
          }
          return types.getTypeParser(typeId, format);
        }
      }
    };
    this.queryConfig = {
      name,
      text: queryString,
      rowMode: "array",
      types: {
        // @ts-ignore
        getTypeParser: (typeId, format) => {
          if (typeId === types.builtins.TIMESTAMPTZ) {
            return (val) => val;
          }
          if (typeId === types.builtins.TIMESTAMP) {
            return (val) => val;
          }
          if (typeId === types.builtins.DATE) {
            return (val) => val;
          }
          if (typeId === types.builtins.INTERVAL) {
            return (val) => val;
          }
          if (typeId === 1231) {
            return (val) => val;
          }
          if (typeId === 1115) {
            return (val) => val;
          }
          if (typeId === 1185) {
            return (val) => val;
          }
          if (typeId === 1187) {
            return (val) => val;
          }
          if (typeId === 1182) {
            return (val) => val;
          }
          return types.getTypeParser(typeId, format);
        }
      }
    };
  }
  static [entityKind] = "NeonPreparedQuery";
  rawQueryConfig;
  queryConfig;
  async execute(placeholderValues = {}) {
    const params = fillPlaceholders(this.params, placeholderValues);
    this.logger.logQuery(this.rawQueryConfig.text, params);
    const { fields, client, rawQueryConfig: rawQuery, queryConfig: query, joinsNotNullableMap, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      return await this.queryWithCache(rawQuery.text, params, async () => {
        return await client.query(rawQuery, params);
      });
    }
    const result = await this.queryWithCache(query.text, params, async () => {
      return await client.query(query, params);
    });
    return customResultMapper ? customResultMapper(result.rows) : result.rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
  }
  all(placeholderValues = {}) {
    const params = fillPlaceholders(this.params, placeholderValues);
    this.logger.logQuery(this.rawQueryConfig.text, params);
    return this.queryWithCache(this.rawQueryConfig.text, params, async () => {
      return await this.client.query(this.rawQueryConfig, params);
    }).then((result) => result.rows);
  }
  values(placeholderValues = {}) {
    const params = fillPlaceholders(this.params, placeholderValues);
    this.logger.logQuery(this.rawQueryConfig.text, params);
    return this.queryWithCache(this.queryConfig.text, params, async () => {
      return await this.client.query(this.queryConfig, params);
    }).then((result) => result.rows);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
class NeonSession extends PgSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
    this.cache = options.cache ?? new NoopCache();
  }
  static [entityKind] = "NeonSession";
  logger;
  cache;
  prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    return new NeonPreparedQuery(
      this.client,
      query.sql,
      query.params,
      this.logger,
      this.cache,
      queryMetadata,
      cacheConfig,
      fields,
      name,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  async query(query, params) {
    this.logger.logQuery(query, params);
    const result = await this.client.query({
      rowMode: "array",
      text: query,
      values: params
    });
    return result;
  }
  async queryObjects(query, params) {
    return this.client.query(query, params);
  }
  async count(sql2) {
    const res = await this.execute(sql2);
    return Number(
      res["rows"][0]["count"]
    );
  }
  async transaction(transaction, config = {}) {
    const session = this.client instanceof Pool ? new NeonSession(await this.client.connect(), this.dialect, this.schema, this.options) : this;
    const tx = new NeonTransaction(this.dialect, session, this.schema);
    await tx.execute(sql`begin ${tx.getTransactionConfigSQL(config)}`);
    try {
      const result = await transaction(tx);
      await tx.execute(sql`commit`);
      return result;
    } catch (error) {
      await tx.execute(sql`rollback`);
      throw error;
    } finally {
      if (this.client instanceof Pool) {
        session.client.release();
      }
    }
  }
}
class NeonTransaction extends PgTransaction {
  static [entityKind] = "NeonTransaction";
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex + 1}`;
    const tx = new NeonTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
    await tx.execute(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await tx.execute(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (e) {
      await tx.execute(sql.raw(`rollback to savepoint ${savepointName}`));
      throw e;
    }
  }
}
export {
  NeonPreparedQuery,
  NeonSession,
  NeonTransaction
};
//# sourceMappingURL=session.js.map