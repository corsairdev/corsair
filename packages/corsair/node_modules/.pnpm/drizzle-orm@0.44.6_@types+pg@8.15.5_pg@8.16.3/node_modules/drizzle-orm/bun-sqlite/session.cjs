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
  PreparedQuery: () => PreparedQuery,
  SQLiteBunSession: () => SQLiteBunSession,
  SQLiteBunTransaction: () => SQLiteBunTransaction
});
module.exports = __toCommonJS(session_exports);
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_sql = require("../sql/sql.cjs");
var import_sqlite_core = require("../sqlite-core/index.cjs");
var import_session = require("../sqlite-core/session.cjs");
var import_utils = require("../utils.cjs");
class SQLiteBunSession extends import_session.SQLiteSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new import_logger.NoopLogger();
  }
  static [import_entity.entityKind] = "SQLiteBunSession";
  logger;
  exec(query) {
    this.client.exec(query);
  }
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
    const stmt = this.client.prepare(query.sql);
    return new PreparedQuery(
      stmt,
      query,
      this.logger,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  transaction(transaction, config = {}) {
    const tx = new SQLiteBunTransaction("sync", this.dialect, this, this.schema);
    let result;
    const nativeTx = this.client.transaction(() => {
      result = transaction(tx);
    });
    nativeTx[config.behavior ?? "deferred"]();
    return result;
  }
}
class SQLiteBunTransaction extends import_sqlite_core.SQLiteTransaction {
  static [import_entity.entityKind] = "SQLiteBunTransaction";
  transaction(transaction) {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new SQLiteBunTransaction("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
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
class PreparedQuery extends import_session.SQLitePreparedQuery {
  constructor(stmt, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("sync", executeMethod, query);
    this.stmt = stmt;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [import_entity.entityKind] = "SQLiteBunPreparedQuery";
  run(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.stmt.run(...params);
  }
  all(placeholderValues) {
    const { fields, query, logger, joinsNotNullableMap, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = (0, import_sql.fillPlaceholders)(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return stmt.all(...params);
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
    const row = this.stmt.values(...params)[0];
    if (!row) {
      return void 0;
    }
    const { fields, joinsNotNullableMap, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      return row;
    }
    if (customResultMapper) {
      return customResultMapper([row]);
    }
    return (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap);
  }
  values(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.stmt.values(...params);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PreparedQuery,
  SQLiteBunSession,
  SQLiteBunTransaction
});
//# sourceMappingURL=session.cjs.map