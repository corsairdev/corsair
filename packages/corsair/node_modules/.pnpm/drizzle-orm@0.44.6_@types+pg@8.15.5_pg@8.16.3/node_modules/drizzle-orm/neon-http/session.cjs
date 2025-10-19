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
  NeonHttpPreparedQuery: () => NeonHttpPreparedQuery,
  NeonHttpSession: () => NeonHttpSession,
  NeonTransaction: () => NeonTransaction
});
module.exports = __toCommonJS(session_exports);
var import_core = require("../cache/core/index.cjs");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_pg_core = require("../pg-core/index.cjs");
var import_session = require("../pg-core/session.cjs");
var import_sql = require("../sql/sql.cjs");
var import_utils = require("../utils.cjs");
const rawQueryConfig = {
  arrayMode: false,
  fullResults: true
};
const queryConfig = {
  arrayMode: true,
  fullResults: true
};
class NeonHttpPreparedQuery extends import_session.PgPreparedQuery {
  constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper) {
    super(query, cache, queryMetadata, cacheConfig);
    this.client = client;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
    this.clientQuery = client.query ?? client;
  }
  static [import_entity.entityKind] = "NeonHttpPreparedQuery";
  clientQuery;
  /** @internal */
  async execute(placeholderValues = {}, token = this.authToken) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    const { fields, clientQuery, query, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      return this.queryWithCache(query.sql, params, async () => {
        return clientQuery(
          query.sql,
          params,
          token === void 0 ? rawQueryConfig : {
            ...rawQueryConfig,
            authToken: token
          }
        );
      });
    }
    const result = await this.queryWithCache(query.sql, params, async () => {
      return await clientQuery(
        query.sql,
        params,
        token === void 0 ? queryConfig : {
          ...queryConfig,
          authToken: token
        }
      );
    });
    return this.mapResult(result);
  }
  mapResult(result) {
    if (!this.fields && !this.customResultMapper) {
      return result;
    }
    const rows = result.rows;
    if (this.customResultMapper) {
      return this.customResultMapper(rows);
    }
    return rows.map((row) => (0, import_utils.mapResultRow)(this.fields, row, this.joinsNotNullableMap));
  }
  all(placeholderValues = {}) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    return this.clientQuery(
      this.query.sql,
      params,
      this.authToken === void 0 ? rawQueryConfig : {
        ...rawQueryConfig,
        authToken: this.authToken
      }
    ).then((result) => result.rows);
  }
  /** @internal */
  values(placeholderValues = {}, token) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    return this.clientQuery(this.query.sql, params, { arrayMode: true, fullResults: true, authToken: token }).then((result) => result.rows);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
class NeonHttpSession extends import_session.PgSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.clientQuery = client.query ?? client;
    this.logger = options.logger ?? new import_logger.NoopLogger();
    this.cache = options.cache ?? new import_core.NoopCache();
  }
  static [import_entity.entityKind] = "NeonHttpSession";
  clientQuery;
  logger;
  cache;
  prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    return new NeonHttpPreparedQuery(
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
  async batch(queries) {
    const preparedQueries = [];
    const builtQueries = [];
    for (const query of queries) {
      const preparedQuery = query._prepare();
      const builtQuery = preparedQuery.getQuery();
      preparedQueries.push(preparedQuery);
      builtQueries.push(
        this.clientQuery(builtQuery.sql, builtQuery.params, {
          fullResults: true,
          arrayMode: preparedQuery.isResponseInArrayMode()
        })
      );
    }
    const batchResults = await this.client.transaction(builtQueries, queryConfig);
    return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
  }
  // change return type to QueryRows<true>
  async query(query, params) {
    this.logger.logQuery(query, params);
    const result = await this.clientQuery(query, params, { arrayMode: true, fullResults: true });
    return result;
  }
  // change return type to QueryRows<false>
  async queryObjects(query, params) {
    return this.clientQuery(query, params, { arrayMode: false, fullResults: true });
  }
  /** @internal */
  async count(sql, token) {
    const res = await this.execute(sql, token);
    return Number(
      res["rows"][0]["count"]
    );
  }
  async transaction(_transaction, _config = {}) {
    throw new Error("No transactions support in neon-http driver");
  }
}
class NeonTransaction extends import_pg_core.PgTransaction {
  static [import_entity.entityKind] = "NeonHttpTransaction";
  async transaction(_transaction) {
    throw new Error("No transactions support in neon-http driver");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NeonHttpPreparedQuery,
  NeonHttpSession,
  NeonTransaction
});
//# sourceMappingURL=session.cjs.map