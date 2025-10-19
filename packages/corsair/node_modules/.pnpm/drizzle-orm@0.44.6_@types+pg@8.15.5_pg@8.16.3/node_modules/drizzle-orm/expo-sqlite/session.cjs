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
  ExpoSQLitePreparedQuery: () => ExpoSQLitePreparedQuery,
  ExpoSQLiteSession: () => ExpoSQLiteSession,
  ExpoSQLiteTransaction: () => ExpoSQLiteTransaction
});
module.exports = __toCommonJS(session_exports);
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_sql = require("../sql/sql.cjs");
var import_sqlite_core = require("../sqlite-core/index.cjs");
var import_session = require("../sqlite-core/session.cjs");
var import_utils = require("../utils.cjs");
class ExpoSQLiteSession extends import_session.SQLiteSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new import_logger.NoopLogger();
  }
  static [import_entity.entityKind] = "ExpoSQLiteSession";
  logger;
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
    const stmt = this.client.prepareSync(query.sql);
    return new ExpoSQLitePreparedQuery(
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
    const tx = new ExpoSQLiteTransaction("sync", this.dialect, this, this.schema);
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
class ExpoSQLiteTransaction extends import_sqlite_core.SQLiteTransaction {
  static [import_entity.entityKind] = "ExpoSQLiteTransaction";
  transaction(transaction) {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new ExpoSQLiteTransaction("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
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
class ExpoSQLitePreparedQuery extends import_session.SQLitePreparedQuery {
  constructor(stmt, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("sync", executeMethod, query);
    this.stmt = stmt;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [import_entity.entityKind] = "ExpoSQLitePreparedQuery";
  run(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    const { changes, lastInsertRowId } = this.stmt.executeSync(params);
    return {
      changes,
      lastInsertRowId
    };
  }
  all(placeholderValues) {
    const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = (0, import_sql.fillPlaceholders)(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return stmt.executeSync(params).getAllSync();
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
    const { fields, stmt, joinsNotNullableMap, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      return stmt.executeSync(params).getFirstSync();
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
    return this.stmt.executeForRawResultSync(params).getAllSync();
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExpoSQLitePreparedQuery,
  ExpoSQLiteSession,
  ExpoSQLiteTransaction
});
//# sourceMappingURL=session.cjs.map