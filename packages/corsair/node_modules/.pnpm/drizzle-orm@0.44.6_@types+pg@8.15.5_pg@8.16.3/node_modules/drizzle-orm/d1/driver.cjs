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
  DrizzleD1Database: () => DrizzleD1Database,
  drizzle: () => drizzle
});
module.exports = __toCommonJS(driver_exports);
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_relations = require("../relations.cjs");
var import_db = require("../sqlite-core/db.cjs");
var import_dialect = require("../sqlite-core/dialect.cjs");
var import_session = require("./session.cjs");
class DrizzleD1Database extends import_db.BaseSQLiteDatabase {
  static [import_entity.entityKind] = "D1Database";
  async batch(batch) {
    return this.session.batch(batch);
  }
}
function drizzle(client, config = {}) {
  const dialect = new import_dialect.SQLiteAsyncDialect({ casing: config.casing });
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
  const session = new import_session.SQLiteD1Session(client, dialect, schema, { logger, cache: config.cache });
  const db = new DrizzleD1Database("async", dialect, session, schema);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DrizzleD1Database,
  drizzle
});
//# sourceMappingURL=driver.cjs.map