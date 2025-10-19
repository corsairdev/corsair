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
  NeonPreparedQuery: () => NeonPreparedQuery,
  NeonSession: () => NeonSession,
  NeonTransaction: () => NeonTransaction
});
module.exports = __toCommonJS(session_exports);
var import_serverless = require("@neondatabase/serverless");
var import_cache = require("../cache/core/cache.cjs");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_pg_core = require("../pg-core/index.cjs");
var import_session = require("../pg-core/session.cjs");
var import_sql = require("../sql/sql.cjs");
var import_utils = require("../utils.cjs");
class NeonPreparedQuery extends import_session.PgPreparedQuery {
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
          if (typeId === import_serverless.types.builtins.TIMESTAMPTZ) {
            return (val) => val;
          }
          if (typeId === import_serverless.types.builtins.TIMESTAMP) {
            return (val) => val;
          }
          if (typeId === import_serverless.types.builtins.DATE) {
            return (val) => val;
          }
          if (typeId === import_serverless.types.builtins.INTERVAL) {
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
          return import_serverless.types.getTypeParser(typeId, format);
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
          if (typeId === import_serverless.types.builtins.TIMESTAMPTZ) {
            return (val) => val;
          }
          if (typeId === import_serverless.types.builtins.TIMESTAMP) {
            return (val) => val;
          }
          if (typeId === import_serverless.types.builtins.DATE) {
            return (val) => val;
          }
          if (typeId === import_serverless.types.builtins.INTERVAL) {
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
          return import_serverless.types.getTypeParser(typeId, format);
        }
      }
    };
  }
  static [import_entity.entityKind] = "NeonPreparedQuery";
  rawQueryConfig;
  queryConfig;
  async execute(placeholderValues = {}) {
    const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues);
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
    return customResultMapper ? customResultMapper(result.rows) : result.rows.map((row) => (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap));
  }
  all(placeholderValues = {}) {
    const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues);
    this.logger.logQuery(this.rawQueryConfig.text, params);
    return this.queryWithCache(this.rawQueryConfig.text, params, async () => {
      return await this.client.query(this.rawQueryConfig, params);
    }).then((result) => result.rows);
  }
  values(placeholderValues = {}) {
    const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues);
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
class NeonSession extends import_session.PgSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new import_logger.NoopLogger();
    this.cache = options.cache ?? new import_cache.NoopCache();
  }
  static [import_entity.entityKind] = "NeonSession";
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
    const session = this.client instanceof import_serverless.Pool ? new NeonSession(await this.client.connect(), this.dialect, this.schema, this.options) : this;
    const tx = new NeonTransaction(this.dialect, session, this.schema);
    await tx.execute(import_sql.sql`begin ${tx.getTransactionConfigSQL(config)}`);
    try {
      const result = await transaction(tx);
      await tx.execute(import_sql.sql`commit`);
      return result;
    } catch (error) {
      await tx.execute(import_sql.sql`rollback`);
      throw error;
    } finally {
      if (this.client instanceof import_serverless.Pool) {
        session.client.release();
      }
    }
  }
}
class NeonTransaction extends import_pg_core.PgTransaction {
  static [import_entity.entityKind] = "NeonTransaction";
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex + 1}`;
    const tx = new NeonTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
    await tx.execute(import_sql.sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await tx.execute(import_sql.sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (e) {
      await tx.execute(import_sql.sql.raw(`rollback to savepoint ${savepointName}`));
      throw e;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NeonPreparedQuery,
  NeonSession,
  NeonTransaction
});
//# sourceMappingURL=session.cjs.map