import { Column } from "../column.js";
import { entityKind, is } from "../entity.js";
import { NoopLogger } from "../logger.js";
import { SingleStoreTransaction } from "../singlestore-core/index.js";
import { SingleStorePreparedQuery as PreparedQueryBase, SingleStoreSession } from "../singlestore-core/session.js";
import { fillPlaceholders } from "../sql/sql.js";
import { mapResultRow } from "../utils.js";
class SingleStoreRemoteSession extends SingleStoreSession {
  constructor(client, dialect, schema, options) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new NoopLogger();
  }
  static [entityKind] = "SingleStoreRemoteSession";
  logger;
  prepareQuery(query, fields, customResultMapper, generatedIds, returningIds) {
    return new PreparedQuery(
      this.client,
      query.sql,
      query.params,
      this.logger,
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
    throw new Error("Transactions are not supported by the SingleStore Proxy driver");
  }
}
class SingleStoreProxyTransaction extends SingleStoreTransaction {
  static [entityKind] = "SingleStoreProxyTransaction";
  async transaction(_transaction) {
    throw new Error("Transactions are not supported by the SingleStore Proxy driver");
  }
}
class PreparedQuery extends PreparedQueryBase {
  constructor(client, queryString, params, logger, fields, customResultMapper, generatedIds, returningIds) {
    super();
    this.client = client;
    this.queryString = queryString;
    this.params = params;
    this.logger = logger;
    this.fields = fields;
    this.customResultMapper = customResultMapper;
    this.generatedIds = generatedIds;
    this.returningIds = returningIds;
  }
  static [entityKind] = "SingleStoreProxyPreparedQuery";
  async execute(placeholderValues = {}) {
    const params = fillPlaceholders(this.params, placeholderValues);
    const { fields, client, queryString, logger, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
    logger.logQuery(queryString, params);
    if (!fields && !customResultMapper) {
      const { rows: data } = await client(queryString, params, "execute");
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
    const { rows } = await client(queryString, params, "all");
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
  }
  iterator(_placeholderValues = {}) {
    throw new Error("Streaming is not supported by the SingleStore Proxy driver");
  }
}
export {
  PreparedQuery,
  SingleStoreProxyTransaction,
  SingleStoreRemoteSession
};
//# sourceMappingURL=session.js.map