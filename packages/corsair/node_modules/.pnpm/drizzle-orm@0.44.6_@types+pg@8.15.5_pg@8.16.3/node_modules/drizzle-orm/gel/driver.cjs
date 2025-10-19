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
  GelDriver: () => GelDriver,
  GelJsDatabase: () => GelJsDatabase,
  drizzle: () => drizzle
});
module.exports = __toCommonJS(driver_exports);
var import_gel = require("gel");
var import_entity = require("../entity.cjs");
var import_db = require("../gel-core/db.cjs");
var import_dialect = require("../gel-core/dialect.cjs");
var import_logger = require("../logger.cjs");
var import_relations = require("../relations.cjs");
var import_utils = require("../utils.cjs");
var import_session = require("./session.cjs");
class GelDriver {
  constructor(client, dialect, options = {}) {
    this.client = client;
    this.dialect = dialect;
    this.options = options;
  }
  static [import_entity.entityKind] = "GelDriver";
  createSession(schema) {
    return new import_session.GelDbSession(this.client, this.dialect, schema, {
      logger: this.options.logger,
      cache: this.options.cache
    });
  }
}
class GelJsDatabase extends import_db.GelDatabase {
  static [import_entity.entityKind] = "GelJsDatabase";
}
function construct(client, config = {}) {
  const dialect = new import_dialect.GelDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new import_logger.DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  let schema;
  if (config.schema) {
    const tablesConfig = (0, import_relations.extractTablesRelationalConfig)(config.schema, import_relations.createTableRelationsHelpers);
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const driver = new GelDriver(client, dialect, { logger, cache: config.cache });
  const session = driver.createSession(schema);
  const db = new GelJsDatabase(dialect, session, schema);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const instance = (0, import_gel.createClient)({ dsn: params[0] });
    return construct(instance, params[1]);
  }
  if ((0, import_utils.isConfig)(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client) return construct(client, drizzleConfig);
    const instance = (0, import_gel.createClient)(connection);
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
  GelDriver,
  GelJsDatabase,
  drizzle
});
//# sourceMappingURL=driver.cjs.map