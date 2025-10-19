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
var driver_exports = {};
__export(driver_exports, {
  SqliteRemoteDatabase: () => SqliteRemoteDatabase,
  drizzle: () => drizzle
});
module.exports = __toCommonJS(driver_exports);
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_relations = require("../relations.cjs");
var import_db = require("../sqlite-core/db.cjs");
var import_dialect = require("../sqlite-core/dialect.cjs");
var import_session = require("./session.cjs");
class SqliteRemoteDatabase extends import_db.BaseSQLiteDatabase {
  static [import_entity.entityKind] = "SqliteRemoteDatabase";
  async batch(batch) {
    return this.session.batch(batch);
  }
}
function drizzle(callback, batchCallback, config) {
  const dialect = new import_dialect.SQLiteAsyncDialect({ casing: config?.casing });
  let logger;
  let cache;
  let _batchCallback;
  let _config = {};
  if (batchCallback) {
    if (typeof batchCallback === "function") {
      _batchCallback = batchCallback;
      _config = config ?? {};
    } else {
      _batchCallback = void 0;
      _config = batchCallback;
    }
    if (_config.logger === true) {
      logger = new import_logger.DefaultLogger();
    } else if (_config.logger !== false) {
      logger = _config.logger;
      cache = _config.cache;
    }
  }
  let schema;
  if (_config.schema) {
    const tablesConfig = (0, import_relations.extractTablesRelationalConfig)(
      _config.schema,
      import_relations.createTableRelationsHelpers
    );
    schema = {
      fullSchema: _config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new import_session.SQLiteRemoteSession(callback, dialect, schema, _batchCallback, { logger, cache });
  const db = new SqliteRemoteDatabase("async", dialect, session, schema);
  db.$cache = cache;
  if (db.$cache) {
    db.$cache["invalidate"] = cache?.onMutate;
  }
  return db;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SqliteRemoteDatabase,
  drizzle
});
//# sourceMappingURL=driver.cjs.map