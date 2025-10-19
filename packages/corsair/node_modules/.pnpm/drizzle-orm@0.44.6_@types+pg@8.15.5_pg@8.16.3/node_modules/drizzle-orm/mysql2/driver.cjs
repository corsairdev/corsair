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
  MySql2Database: () => MySql2Database,
  MySql2Driver: () => MySql2Driver,
  MySqlDatabase: () => import_db2.MySqlDatabase,
  drizzle: () => drizzle
});
module.exports = __toCommonJS(driver_exports);
var import_mysql2 = require("mysql2");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_db = require("../mysql-core/db.cjs");
var import_dialect = require("../mysql-core/dialect.cjs");
var import_relations = require("../relations.cjs");
var import_utils = require("../utils.cjs");
var import_errors = require("../errors.cjs");
var import_session = require("./session.cjs");
var import_db2 = require("../mysql-core/db.cjs");
class MySql2Driver {
  constructor(client, dialect, options = {}) {
    this.client = client;
    this.dialect = dialect;
    this.options = options;
  }
  static [import_entity.entityKind] = "MySql2Driver";
  createSession(schema, mode) {
    return new import_session.MySql2Session(this.client, this.dialect, schema, {
      logger: this.options.logger,
      mode,
      cache: this.options.cache
    });
  }
}
class MySql2Database extends import_db.MySqlDatabase {
  static [import_entity.entityKind] = "MySql2Database";
}
function construct(client, config = {}) {
  const dialect = new import_dialect.MySqlDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new import_logger.DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  const clientForInstance = isCallbackClient(client) ? client.promise() : client;
  let schema;
  if (config.schema) {
    if (config.mode === void 0) {
      throw new import_errors.DrizzleError({
        message: 'You need to specify "mode": "planetscale" or "default" when providing a schema. Read more: https://orm.drizzle.team/docs/rqb#modes'
      });
    }
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
  const mode = config.mode ?? "default";
  const driver = new MySql2Driver(clientForInstance, dialect, { logger, cache: config.cache });
  const session = driver.createSession(schema, mode);
  const db = new MySql2Database(dialect, session, schema, mode);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
function isCallbackClient(client) {
  return typeof client.promise === "function";
}
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const connectionString = params[0];
    const instance = (0, import_mysql2.createPool)({
      uri: connectionString
    });
    return construct(instance, params[1]);
  }
  if ((0, import_utils.isConfig)(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client) return construct(client, drizzleConfig);
    const instance = typeof connection === "string" ? (0, import_mysql2.createPool)({
      uri: connection,
      supportBigNumbers: true
    }) : (0, import_mysql2.createPool)(connection);
    const db = construct(instance, drizzleConfig);
    return db;
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
  MySql2Database,
  MySql2Driver,
  MySqlDatabase,
  drizzle
});
//# sourceMappingURL=driver.cjs.map