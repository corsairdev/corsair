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
  OPSQLitePreparedQuery: () => OPSQLitePreparedQuery,
  OPSQLiteSession: () => OPSQLiteSession,
  OPSQLiteTransaction: () => OPSQLiteTransaction
});
module.exports = __toCommonJS(session_exports);
var import_core = require("../cache/core/index.cjs");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_sql = require("../sql/sql.cjs");
var import_sqlite_core = require("../sqlite-core/index.cjs");
var import_session = require("../sqlite-core/session.cjs");
var import_utils = require("../utils.cjs");
class OPSQLiteSession extends import_session.SQLiteSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new import_logger.NoopLogger();
    this.cache = options.cache ?? new import_core.NoopCache();
  }
  static [import_entity.entityKind] = "OPSQLiteSession";
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
    this.run(import_sql.sql.raw(`begin${config?.behavior ? " " + config.behavior : ""}`));
    try {
      const result = transaction(tx);
      this.run(import_sql.sql`commit`);
      return result;
    } catch (err) {
      this.run(import_sql.sql`rollback`);
      throw err;
    }
  }
}
class OPSQLiteTransaction extends import_sqlite_core.SQLiteTransaction {
  static [import_entity.entityKind] = "OPSQLiteTransaction";
  transaction(transaction) {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new OPSQLiteTransaction("async", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.run(import_sql.sql.raw(`savepoint ${savepointName}`));
    try {
      const result = transaction(tx);
      this.session.run(import_sql.sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      this.session.run(import_sql.sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
}
class OPSQLitePreparedQuery extends import_session.SQLitePreparedQuery {
  constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("sync", executeMethod, query, cache, queryMetadata, cacheConfig);
    this.client = client;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [import_entity.entityKind] = "OPSQLitePreparedQuery";
  async run(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return await this.queryWithCache(this.query.sql, params, async () => {
      return this.client.executeAsync(this.query.sql, params);
    });
  }
  async all(placeholderValues) {
    const { fields, joinsNotNullableMap, query, logger, customResultMapper, client } = this;
    if (!fields && !customResultMapper) {
      const params = (0, import_sql.fillPlaceholders)(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return await this.queryWithCache(query.sql, params, async () => {
        return client.execute(query.sql, params).rows?._array || [];
      });
    }
    const rows = await this.values(placeholderValues);
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap));
  }
  async get(placeholderValues) {
    const { fields, joinsNotNullableMap, customResultMapper, query, logger, client } = this;
    const params = (0, import_sql.fillPlaceholders)(query.params, placeholderValues ?? {});
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
    return (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap);
  }
  async values(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OPSQLitePreparedQuery,
  OPSQLiteSession,
  OPSQLiteTransaction
});
//# sourceMappingURL=session.cjs.map