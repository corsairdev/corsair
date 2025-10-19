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
  SQLiteDOPreparedQuery: () => SQLiteDOPreparedQuery,
  SQLiteDOSession: () => SQLiteDOSession,
  SQLiteDOTransaction: () => SQLiteDOTransaction
});
module.exports = __toCommonJS(session_exports);
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_sql = require("../sql/sql.cjs");
var import_sqlite_core = require("../sqlite-core/index.cjs");
var import_session = require("../sqlite-core/session.cjs");
var import_session2 = require("../sqlite-core/session.cjs");
var import_utils = require("../utils.cjs");
class SQLiteDOSession extends import_session.SQLiteSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new import_logger.NoopLogger();
  }
  static [import_entity.entityKind] = "SQLiteDOSession";
  logger;
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
    return new SQLiteDOPreparedQuery(
      this.client,
      query,
      this.logger,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  transaction(transaction, _config) {
    const tx = new SQLiteDOTransaction("sync", this.dialect, this, this.schema);
    this.client.transactionSync(() => {
      transaction(tx);
    });
    return {};
  }
}
class SQLiteDOTransaction extends import_sqlite_core.SQLiteTransaction {
  static [import_entity.entityKind] = "SQLiteDOTransaction";
  transaction(transaction) {
    const tx = new SQLiteDOTransaction("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.transaction(() => transaction(tx));
    return {};
  }
}
class SQLiteDOPreparedQuery extends import_session2.SQLitePreparedQuery {
  constructor(client, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("sync", executeMethod, query, void 0, void 0, void 0);
    this.client = client;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [import_entity.entityKind] = "SQLiteDOPreparedQuery";
  run(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    params.length > 0 ? this.client.sql.exec(this.query.sql, ...params) : this.client.sql.exec(this.query.sql);
  }
  all(placeholderValues) {
    const { fields, joinsNotNullableMap, query, logger, client, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = (0, import_sql.fillPlaceholders)(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return params.length > 0 ? client.sql.exec(query.sql, ...params).toArray() : client.sql.exec(query.sql).toArray();
    }
    const rows = this.values(placeholderValues);
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap));
  }
  get(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    const { fields, client, joinsNotNullableMap, customResultMapper, query } = this;
    if (!fields && !customResultMapper) {
      return (params.length > 0 ? client.sql.exec(query.sql, ...params) : client.sql.exec(query.sql)).next().value;
    }
    const rows = this.values(placeholderValues);
    const row = rows[0];
    if (!row) {
      return void 0;
    }
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap);
  }
  values(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    const res = params.length > 0 ? this.client.sql.exec(this.query.sql, ...params) : this.client.sql.exec(this.query.sql);
    return res.raw().toArray();
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SQLiteDOPreparedQuery,
  SQLiteDOSession,
  SQLiteDOTransaction
});
//# sourceMappingURL=session.cjs.map