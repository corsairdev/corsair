import { NoopCache } from "../cache/core/index.js";
import { Column } from "../column.js";
import { entityKind, is } from "../entity.js";
import { NoopLogger } from "../logger.js";
import { MySqlTransaction } from "../mysql-core/index.js";
import { MySqlPreparedQuery as PreparedQueryBase, MySqlSession } from "../mysql-core/session.js";
import { fillPlaceholders } from "../sql/sql.js";
import { mapResultRow } from "../utils.js";
class MySqlRemoteSession extends MySqlSession {
  constructor(client, dialect, schema, options) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new NoopLogger();
    this.cache = options.cache ?? new NoopCache();
  }
  static [entityKind] = "MySqlRemoteSession";
  logger;
  cache;
  prepareQuery(query, fields, customResultMapper, generatedIds, returningIds, queryMetadata, cacheConfig) {
    return new PreparedQuery(
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
    return this.client(querySql.sql, querySql.params, "all").then(({ rows }) => rows);
  }
  async transaction(_transaction, _config) {
    throw new Error("Transactions are not supported by the MySql Proxy driver");
  }
}
class MySqlProxyTransaction extends MySqlTransaction {
  static [entityKind] = "MySqlProxyTransaction";
  async transaction(_transaction) {
    throw new Error("Transactions are not supported by the MySql Proxy driver");
  }
}
class PreparedQuery extends PreparedQueryBase {
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
  static [entityKind] = "MySqlProxyPreparedQuery";
  async execute(placeholderValues = {}) {
    const params = fillPlaceholders(this.params, placeholderValues);
    const { fields, client, queryString, logger, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
    logger.logQuery(queryString, params);
    if (!fields && !customResultMapper) {
      const { rows: data } = await this.queryWithCache(queryString, params, async () => {
        return await client(queryString, params, "execute");
      });
      const insertId = data[0].insertId;
      const affectedRows = data[0].affectedRows;
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
      return data;
    }
    const { rows } = await this.queryWithCache(queryString, params, async () => {
      return await client(queryString, params, "all");
    });
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
  }
  iterator(_placeholderValues = {}) {
    throw new Error("Streaming is not supported by the MySql Proxy driver");
  }
}
export {
  MySqlProxyTransaction,
  MySqlRemoteSession,
  PreparedQuery
};
//# sourceMappingURL=session.js.map