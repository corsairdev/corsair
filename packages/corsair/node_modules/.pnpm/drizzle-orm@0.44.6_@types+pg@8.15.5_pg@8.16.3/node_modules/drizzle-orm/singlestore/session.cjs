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
  SingleStoreDriverPreparedQuery: () => SingleStoreDriverPreparedQuery,
  SingleStoreDriverSession: () => SingleStoreDriverSession,
  SingleStoreDriverTransaction: () => SingleStoreDriverTransaction
});
module.exports = __toCommonJS(session_exports);
var import_node_events = require("node:events");
var import_core = require("../cache/core/index.cjs");
var import_column = require("../column.cjs");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_session = require("../singlestore-core/session.cjs");
var import_sql = require("../sql/sql.cjs");
var import_utils = require("../utils.cjs");
class SingleStoreDriverPreparedQuery extends import_session.SingleStorePreparedQuery {
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
  static [import_entity.entityKind] = "SingleStoreDriverPreparedQuery";
  rawQuery;
  query;
  async execute(placeholderValues = {}) {
    const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues);
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
            if ((0, import_entity.is)(column.field, import_column.Column)) {
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
    return rows.map((row) => (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap));
  }
  async *iterator(placeholderValues = {}) {
    const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues);
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
      const onEnd = (0, import_node_events.once)(stream, "end");
      const onError = (0, import_node_events.once)(stream, "error");
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
              yield (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap);
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
class SingleStoreDriverSession extends import_session.SingleStoreSession {
  constructor(client, dialect, schema, options) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new import_logger.NoopLogger();
    this.cache = options.cache ?? new import_core.NoopCache();
  }
  static [import_entity.entityKind] = "SingleStoreDriverSession";
  logger;
  cache;
  prepareQuery(query, fields, customResultMapper, generatedIds, returningIds, queryMetadata, cacheConfig) {
    return new SingleStoreDriverPreparedQuery(
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
    const session = isPool(this.client) ? new SingleStoreDriverSession(
      await this.client.getConnection(),
      this.dialect,
      this.schema,
      this.options
    ) : this;
    const tx = new SingleStoreDriverTransaction(
      this.dialect,
      session,
      this.schema,
      0
    );
    if (config) {
      const setTransactionConfigSql = this.getSetTransactionSQL(config);
      if (setTransactionConfigSql) {
        await tx.execute(setTransactionConfigSql);
      }
      const startTransactionSql = this.getStartTransactionSQL(config);
      await (startTransactionSql ? tx.execute(startTransactionSql) : tx.execute(import_sql.sql`begin`));
    } else {
      await tx.execute(import_sql.sql`begin`);
    }
    try {
      const result = await transaction(tx);
      await tx.execute(import_sql.sql`commit`);
      return result;
    } catch (err) {
      await tx.execute(import_sql.sql`rollback`);
      throw err;
    } finally {
      if (isPool(this.client)) {
        session.client.release();
      }
    }
  }
}
class SingleStoreDriverTransaction extends import_session.SingleStoreTransaction {
  static [import_entity.entityKind] = "SingleStoreDriverTransaction";
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex + 1}`;
    const tx = new SingleStoreDriverTransaction(
      this.dialect,
      this.session,
      this.schema,
      this.nestedIndex + 1
    );
    await tx.execute(import_sql.sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await tx.execute(import_sql.sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      await tx.execute(import_sql.sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
}
function isPool(client) {
  return "getConnection" in client;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreDriverPreparedQuery,
  SingleStoreDriverSession,
  SingleStoreDriverTransaction
});
//# sourceMappingURL=session.cjs.map