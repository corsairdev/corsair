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
const executeRawConfig = { fullResult: true };
const queryConfig = { arrayMode: true };
class TiDBServerlessPreparedQuery extends MySqlPreparedQuery {
  constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, customResultMapper, generatedIds, returningIds) {
    super(cache, queryMetadata, cacheConfig);
    this.client = client;
    this.queryString = queryString;
    this.params = params;
    this.logger = logger;
    this.fields = fields;
    this.customResultMapper = customResultMapper;
    this.generatedIds = generatedIds;
    this.returningIds = returningIds;
  }
  static [entityKind] = "TiDBPreparedQuery";
  async execute(placeholderValues = {}) {
    const params = fillPlaceholders(this.params, placeholderValues);
    this.logger.logQuery(this.queryString, params);
    const { fields, client, queryString, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
    if (!fields && !customResultMapper) {
      const res = await this.queryWithCache(queryString, params, async () => {
        return await client.execute(queryString, params, executeRawConfig);
      });
      const insertId = res.lastInsertId ?? 0;
      const affectedRows = res.rowsAffected ?? 0;
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
    const rows = await this.queryWithCache(queryString, params, async () => {
      return await client.execute(queryString, params, queryConfig);
    });
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
  }
  iterator(_placeholderValues) {
    throw new Error("Streaming is not supported by the TiDB Cloud Serverless driver");
  }
}
class TiDBServerlessSession extends MySqlSession {
  constructor(baseClient, dialect, tx, schema, options = {}) {
    super(dialect);
    this.baseClient = baseClient;
    this.schema = schema;
    this.options = options;
    this.client = tx ?? baseClient;
    this.logger = options.logger ?? new NoopLogger();
    this.cache = options.cache ?? new NoopCache();
  }
  static [entityKind] = "TiDBServerlessSession";
  logger;
  client;
  cache;
  prepareQuery(query, fields, customResultMapper, generatedIds, returningIds, queryMetadata, cacheConfig) {
    return new TiDBServerlessPreparedQuery(
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
  all(query) {
    const querySql = this.dialect.sqlToQuery(query);
    this.logger.logQuery(querySql.sql, querySql.params);
    return this.client.execute(querySql.sql, querySql.params);
  }
  async count(sql2) {
    const res = await this.execute(sql2);
    return Number(
      res["rows"][0]["count"]
    );
  }
  async transaction(transaction) {
    const nativeTx = await this.baseClient.begin();
    try {
      const session = new TiDBServerlessSession(this.baseClient, this.dialect, nativeTx, this.schema, this.options);
      const tx = new TiDBServerlessTransaction(
        this.dialect,
        session,
        this.schema
      );
      const result = await transaction(tx);
      await nativeTx.commit();
      return result;
    } catch (err) {
      await nativeTx.rollback();
      throw err;
    }
  }
}
class TiDBServerlessTransaction extends MySqlTransaction {
  static [entityKind] = "TiDBServerlessTransaction";
  constructor(dialect, session, schema, nestedIndex = 0) {
    super(dialect, session, schema, nestedIndex, "default");
  }
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex + 1}`;
    const tx = new TiDBServerlessTransaction(
      this.dialect,
      this.session,
      this.schema,
      this.nestedIndex + 1
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
export {
  TiDBServerlessPreparedQuery,
  TiDBServerlessSession,
  TiDBServerlessTransaction
};
//# sourceMappingURL=session.js.map