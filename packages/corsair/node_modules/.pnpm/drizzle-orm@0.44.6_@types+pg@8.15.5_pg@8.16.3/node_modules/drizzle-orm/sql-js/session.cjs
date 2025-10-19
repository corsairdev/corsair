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
  SQLJsSession: () => SQLJsSession,
  SQLJsTransaction: () => SQLJsTransaction
});
module.exports = __toCommonJS(session_exports);
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_sql = require("../sql/sql.cjs");
var import_sqlite_core = require("../sqlite-core/index.cjs");
var import_session = require("../sqlite-core/session.cjs");
var import_utils = require("../utils.cjs");
class SQLJsSession extends import_session.SQLiteSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new import_logger.NoopLogger();
  }
  static [import_entity.entityKind] = "SQLJsSession";
  logger;
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode) {
    return new PreparedQuery(this.client, query, this.logger, fields, executeMethod, isResponseInArrayMode);
  }
  transaction(transaction, config = {}) {
    const tx = new SQLJsTransaction("sync", this.dialect, this, this.schema);
    this.run(import_sql.sql.raw(`begin${config.behavior ? ` ${config.behavior}` : ""}`));
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
class SQLJsTransaction extends import_sqlite_core.SQLiteTransaction {
  static [import_entity.entityKind] = "SQLJsTransaction";
  transaction(transaction) {
    const savepointName = `sp${this.nestedIndex + 1}`;
    const tx = new SQLJsTransaction("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    tx.run(import_sql.sql.raw(`savepoint ${savepointName}`));
    try {
      const result = transaction(tx);
      tx.run(import_sql.sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      tx.run(import_sql.sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
}
class PreparedQuery extends import_session.SQLitePreparedQuery {
  constructor(client, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("sync", executeMethod, query);
    this.client = client;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [import_entity.entityKind] = "SQLJsPreparedQuery";
  run(placeholderValues) {
    const stmt = this.client.prepare(this.query.sql);
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    const result = stmt.run(params);
    stmt.free();
    return result;
  }
  all(placeholderValues) {
    const stmt = this.client.prepare(this.query.sql);
    const { fields, joinsNotNullableMap, logger, query, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = (0, import_sql.fillPlaceholders)(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      stmt.bind(params);
      const rows2 = [];
      while (stmt.step()) {
        rows2.push(stmt.getAsObject());
      }
      stmt.free();
      return rows2;
    }
    const rows = this.values(placeholderValues);
    if (customResultMapper) {
      return customResultMapper(rows, normalizeFieldValue);
    }
    return rows.map((row) => (0, import_utils.mapResultRow)(fields, row.map((v) => normalizeFieldValue(v)), joinsNotNullableMap));
  }
  get(placeholderValues) {
    const stmt = this.client.prepare(this.query.sql);
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    const { fields, joinsNotNullableMap, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const result = stmt.getAsObject(params);
      stmt.free();
      return result;
    }
    const row = stmt.get(params);
    stmt.free();
    if (!row || row.length === 0 && fields.length > 0) {
      return void 0;
    }
    if (customResultMapper) {
      return customResultMapper([row], normalizeFieldValue);
    }
    return (0, import_utils.mapResultRow)(fields, row.map((v) => normalizeFieldValue(v)), joinsNotNullableMap);
  }
  values(placeholderValues) {
    const stmt = this.client.prepare(this.query.sql);
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.get());
    }
    stmt.free();
    return rows;
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
function normalizeFieldValue(value) {
  if (value instanceof Uint8Array) {
    if (typeof Buffer !== "undefined") {
      if (!(value instanceof Buffer)) {
        return Buffer.from(value);
      }
      return value;
    }
    if (typeof TextDecoder !== "undefined") {
      return new TextDecoder().decode(value);
    }
    throw new Error("TextDecoder is not available. Please provide either Buffer or TextDecoder polyfill.");
  }
  return value;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PreparedQuery,
  SQLJsSession,
  SQLJsTransaction
});
//# sourceMappingURL=session.cjs.map