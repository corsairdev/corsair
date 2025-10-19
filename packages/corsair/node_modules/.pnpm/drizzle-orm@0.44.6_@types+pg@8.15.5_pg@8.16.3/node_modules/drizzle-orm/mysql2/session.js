import { once } from "node:events";
import { NoopCache } from "../cache/core/index.js";
import { Column } from "../column.js";
import { entityKind, is } from "../entity.js";
import { NoopLogger } from "../logger.js";
import {
  MySqlPreparedQuery,
  MySqlSession,
  MySqlTransaction
} from "../mysql-core/session.js";
import { fillPlaceholders, sql } from "../sql/sql.js";
import { mapResultRow } from "../utils.js";
class MySql2PreparedQuery extends MySqlPreparedQuery {
  constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, customResultMapper, generatedIds, returningIds) {
    super(cache, queryMetadata, cacheConfig);
    this.client = client;
    this.params = params;
    this.logger = logger;
    this.fields = fields;
    this.customResultMapper = customResultMapper;
    this.generatedIds = generatedIds;
    this.returningIds = returningIds;
    this.rawQuery = {
      sql: queryString,
      // rowsAsArray: true,
      typeCast: function(field, next) {
        if (field.type === "TIMESTAMP" || field.type === "DATETIME" || field.type === "DATE") {
          return field.string();
        }
        return next();
      }
    };
    this.query = {
      sql: queryString,
      rowsAsArray: true,
      typeCast: function(field, next) {
        if (field.type === "TIMESTAMP" || field.type === "DATETIME" || field.type === "DATE") {
          return field.string();
        }
        return next();
      }
    };
  }
  static [entityKind] = "MySql2PreparedQuery";
  rawQuery;
  query;
  async execute(placeholderValues = {}) {
    const params = fillPlaceholders(this.params, placeholderValues);
    this.logger.logQuery(this.rawQuery.sql, params);
    const { fields, client, rawQuery, query, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
    if (!fields && !customResultMapper) {
      const res = await this.queryWithCache(rawQuery.sql, params, async () => {
        return await client.query(rawQuery, params);
      });
      const insertId = res[0].insertId;
      const affectedRows = res[0].affectedRows;
      if (returningIds) {
        const returningResponse = [];
        let j = 0;
        for (let i = insertId; i < insertId + affectedRows; i++) {
          for (const column of returningIds) {
            const key = returningIds[0].path[0];
            if (is(column.field, Column)) {
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
    const result = await this.queryWithCache(query.sql, params, async () => {
      return await client.query(query, params);
    });
    const rows = result[0];
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
  }
  async *iterator(placeholderValues = {}) {
    const params = fillPlaceholders(this.params, placeholderValues);
    const conn = (isPool(this.client) ? await this.client.getConnection() : this.client).connection;
    const { fields, query, rawQuery, joinsNotNullableMap, client, customResultMapper } = this;
    const hasRowsMapper = Boolean(fields || customResultMapper);
    const driverQuery = hasRowsMapper ? conn.query(query, params) : conn.query(rawQuery, params);
    const stream = driverQuery.stream();
    function dataListener() {
      stream.pause();
    }
    stream.on("data", dataListener);
    try {
      const onEnd = once(stream, "end");
      const onError = once(stream, "error");
      while (true) {
        stream.resume();
        const row = await Promise.race([onEnd, onError, new Promise((resolve) => stream.once("data", resolve))]);
        if (row === void 0 || Array.isArray(row) && row.length === 0) {
          break;
        } else if (row instanceof Error) {
          throw row;
        } else {
          if (hasRowsMapper) {
            if (customResultMapper) {
              const mappedRow = customResultMapper([row]);
              yield Array.isArray(mappedRow) ? mappedRow[0] : mappedRow;
            } else {
              yield mapResultRow(fields, row, joinsNotNullableMap);
            }
          } else {
            yield row;
          }
        }
      }
    } finally {
      stream.off("data", dataListener);
      if (isPool(client)) {
        conn.end();
      }
    }
  }
}
class MySql2Session extends MySqlSession {
  constructor(client, dialect, schema, options) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
    this.cache = options.cache ?? new NoopCache();
    this.mode = options.mode;
  }
  static [entityKind] = "MySql2Session";
  logger;
  mode;
  cache;
  prepareQuery(query, fields, customResultMapper, generatedIds, returningIds, queryMetadata, cacheConfig) {
    return new MySql2PreparedQuery(
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
  /**
   * @internal
   * What is its purpose?
   */
  async query(query, params) {
    this.logger.logQuery(query, params);
    const result = await this.client.query({
      sql: query,
      values: params,
      rowsAsArray: true,
      typeCast: function(field, next) {
        if (field.type === "TIMESTAMP" || field.type === "DATETIME" || field.type === "DATE") {
          return field.string();
        }
        return next();
      }
    });
    return result;
  }
  all(query) {
    const querySql = this.dialect.sqlToQuery(query);
    this.logger.logQuery(querySql.sql, querySql.params);
    return this.client.execute(querySql.sql, querySql.params).then((result) => result[0]);
  }
  async transaction(transaction, config) {
    const session = isPool(this.client) ? new MySql2Session(
      await this.client.getConnection(),
      this.dialect,
      this.schema,
      this.options
    ) : this;
    const tx = new MySql2Transaction(
      this.dialect,
      session,
      this.schema,
      0,
      this.mode
    );
    if (config) {
      const setTransactionConfigSql = this.getSetTransactionSQL(config);
      if (setTransactionConfigSql) {
        await tx.execute(setTransactionConfigSql);
      }
      const startTransactionSql = this.getStartTransactionSQL(config);
      await (startTransactionSql ? tx.execute(startTransactionSql) : tx.execute(sql`begin`));
    } else {
      await tx.execute(sql`begin`);
    }
    try {
      const result = await transaction(tx);
      await tx.execute(sql`commit`);
      return result;
    } catch (err) {
      await tx.execute(sql`rollback`);
      throw err;
    } finally {
      if (isPool(this.client)) {
        session.client.release();
      }
    }
  }
}
class MySql2Transaction extends MySqlTransaction {
  static [entityKind] = "MySql2Transaction";
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex + 1}`;
    const tx = new MySql2Transaction(
      this.dialect,
      this.session,
      this.schema,
      this.nestedIndex + 1,
      this.mode
    );
    await tx.execute(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await tx.execute(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      await tx.execute(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
}
function isPool(client) {
  return "getConnection" in client;
}
export {
  MySql2PreparedQuery,
  MySql2Session,
  MySql2Transaction
};
//# sourceMappingURL=session.js.map