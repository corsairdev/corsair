"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var driver_exports = {};
__export(driver_exports, {
  NodePgDatabase: () => NodePgDatabase,
  NodePgDriver: () => NodePgDriver,
  drizzle: () => drizzle
});
module.exports = __toCommonJS(driver_exports);
var import_pg = __toESM(require("pg"), 1);
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_db = require("../pg-core/db.cjs");
var import_dialect = require("../pg-core/dialect.cjs");
var import_relations = require("../relations.cjs");
var import_utils = require("../utils.cjs");
var import_session = require("./session.cjs");
class NodePgDriver {
  constructor(client, dialect, options = {}) {
    this.client = client;
    this.dialect = dialect;
    this.options = options;
  }
  static [import_entity.entityKind] = "NodePgDriver";
  createSession(schema) {
    return new import_session.NodePgSession(this.client, this.dialect, schema, {
      logger: this.options.logger,
      cache: this.options.cache
    });
  }
}
class NodePgDatabase extends import_db.PgDatabase {
  static [import_entity.entityKind] = "NodePgDatabase";
}
function construct(client, config = {}) {
  const dialect = new import_dialect.PgDialect({ casing: config.casing });
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
  const driver = new NodePgDriver(client, dialect, { logger, cache: config.cache });
  const session = driver.createSession(schema);
  const db = new NodePgDatabase(dialect, session, schema);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const instance = new import_pg.default.Pool({
      connectionString: params[0]
    });
    return construct(instance, params[1]);
  }
  if ((0, import_utils.isConfig)(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client) return construct(client, drizzleConfig);
    const instance = typeof connection === "string" ? new import_pg.default.Pool({
      connectionString: connection
    }) : new import_pg.default.Pool(connection);
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
  NodePgDatabase,
  NodePgDriver,
  drizzle
});
//# sourceMappingURL=driver.cjs.map