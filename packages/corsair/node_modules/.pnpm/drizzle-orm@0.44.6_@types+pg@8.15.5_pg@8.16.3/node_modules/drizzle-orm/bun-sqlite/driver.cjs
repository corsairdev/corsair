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
  BunSQLiteDatabase: () => BunSQLiteDatabase,
  drizzle: () => drizzle
});
module.exports = __toCommonJS(driver_exports);
var import_bun_sqlite = require("bun:sqlite");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_relations = require("../relations.cjs");
var import_db = require("../sqlite-core/db.cjs");
var import_dialect = require("../sqlite-core/dialect.cjs");
var import_utils = require("../utils.cjs");
var import_session = require("./session.cjs");
class BunSQLiteDatabase extends import_db.BaseSQLiteDatabase {
  static [import_entity.entityKind] = "BunSQLiteDatabase";
}
function construct(client, config = {}) {
  const dialect = new import_dialect.SQLiteSyncDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new import_logger.DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  let schema;
  if (config.schema) {
    const tablesConfig = (0, import_relations.extractTablesRelationalConfig)(
      config.schema,
      import_relations.createTableRelationsHelpers
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new import_session.SQLiteBunSession(client, dialect, schema, { logger });
  const db = new BunSQLiteDatabase("sync", dialect, session, schema);
  db.$client = client;
  return db;
}
function drizzle(...params) {
  if (params[0] === void 0 || typeof params[0] === "string") {
    const instance = params[0] === void 0 ? new import_bun_sqlite.Database() : new import_bun_sqlite.Database(params[0]);
    return construct(instance, params[1]);
  }
  if ((0, import_utils.isConfig)(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client) return construct(client, drizzleConfig);
    if (typeof connection === "object") {
      const { source, ...opts } = connection;
      const options = Object.values(opts).filter((v) => v !== void 0).length ? opts : void 0;
      const instance2 = new import_bun_sqlite.Database(source, options);
      return construct(instance2, drizzleConfig);
    }
    const instance = new import_bun_sqlite.Database(connection);
    return construct(instance, drizzleConfig);
  }
  return construct(params[0], params[1]);
}
((drizzle2) => {
  function mock(config) {
    return construct({}, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BunSQLiteDatabase,
  drizzle
});
//# sourceMappingURL=driver.cjs.map