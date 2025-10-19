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
  XataHttpPreparedQuery: () => XataHttpPreparedQuery,
  XataHttpSession: () => XataHttpSession,
  XataTransaction: () => XataTransaction
});
module.exports = __toCommonJS(session_exports);
var import_core = require("../cache/core/index.cjs");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_pg_core = require("../pg-core/index.cjs");
var import_session = require("../pg-core/session.cjs");
var import_sql = require("../sql/sql.cjs");
var import_utils = require("../utils.cjs");
class XataHttpPreparedQuery extends import_session.PgPreparedQuery {
  constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper) {
    super(query, cache, queryMetadata, cacheConfig);
    this.client = client;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [import_entity.entityKind] = "XataHttpPreparedQuery";
  async execute(placeholderValues = {}) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues);
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
    return customResultMapper ? customResultMapper(rows) : rows.map((row) => (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap));
  }
  all(placeholderValues = {}) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues);
    this.logger.logQuery(this.query.sql, params);
    return this.queryWithCache(this.query.sql, params, async () => {
      return this.client.sql({ statement: this.query.sql, params, responseType: "array" });
    }).then((result) => result.rows);
  }
  values(placeholderValues = {}) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues);
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
class XataHttpSession extends import_session.PgSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new import_logger.NoopLogger();
    this.cache = options.cache ?? new import_core.NoopCache();
  }
  static [import_entity.entityKind] = "XataHttpSession";
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
class XataTransaction extends import_pg_core.PgTransaction {
  static [import_entity.entityKind] = "XataHttpTransaction";
  async transaction(_transaction) {
    throw new Error("No transactions support in Xata Http driver");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  XataHttpPreparedQuery,
  XataHttpSession,
  XataTransaction
});
//# sourceMappingURL=session.cjs.map