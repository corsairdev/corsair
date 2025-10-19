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
  NeonHttpDatabase: () => NeonHttpDatabase,
  NeonHttpDriver: () => NeonHttpDriver,
  drizzle: () => drizzle
});
module.exports = __toCommonJS(driver_exports);
var import_serverless = require("@neondatabase/serverless");
var import_entity = require("../entity.cjs");
var import_logger = require("../logger.cjs");
var import_db = require("../pg-core/db.cjs");
var import_dialect = require("../pg-core/dialect.cjs");
var import_relations = require("../relations.cjs");
var import_utils = require("../utils.cjs");
var import_session = require("./session.cjs");
class NeonHttpDriver {
  constructor(client, dialect, options = {}) {
    this.client = client;
    this.dialect = dialect;
    this.options = options;
    this.initMappers();
  }
  static [import_entity.entityKind] = "NeonHttpDriver";
  createSession(schema) {
    return new import_session.NeonHttpSession(this.client, this.dialect, schema, {
      logger: this.options.logger,
      cache: this.options.cache
    });
  }
  initMappers() {
    import_serverless.types.setTypeParser(import_serverless.types.builtins.TIMESTAMPTZ, (val) => val);
    import_serverless.types.setTypeParser(import_serverless.types.builtins.TIMESTAMP, (val) => val);
    import_serverless.types.setTypeParser(import_serverless.types.builtins.DATE, (val) => val);
    import_serverless.types.setTypeParser(import_serverless.types.builtins.INTERVAL, (val) => val);
    import_serverless.types.setTypeParser(1231, (val) => val);
    import_serverless.types.setTypeParser(1115, (val) => val);
    import_serverless.types.setTypeParser(1185, (val) => val);
    import_serverless.types.setTypeParser(1187, (val) => val);
    import_serverless.types.setTypeParser(1182, (val) => val);
  }
}
function wrap(target, token, cb, deep) {
  return new Proxy(target, {
    get(target2, p) {
      const element = target2[p];
      if (typeof element !== "function" && (typeof element !== "object" || element === null)) return element;
      if (deep) return wrap(element, token, cb);
      if (p === "query") return wrap(element, token, cb, true);
      return new Proxy(element, {
        apply(target3, thisArg, argArray) {
          const res = target3.call(thisArg, ...argArray);
          if (typeof res === "object" && res !== null && "setToken" in res && typeof res.setToken === "function") {
            res.setToken(token);
          }
          return cb(target3, p, res);
        }
      });
    }
  });
}
class NeonHttpDatabase extends import_db.PgDatabase {
  static [import_entity.entityKind] = "NeonHttpDatabase";
  $withAuth(token) {
    this.authToken = token;
    return wrap(this, token, (target, p, res) => {
      if (p === "with") {
        return wrap(res, token, (_, __, res2) => res2);
      }
      return res;
    });
  }
  async batch(batch) {
    return this.session.batch(batch);
  }
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
  const driver = new NeonHttpDriver(client, dialect, { logger, cache: config.cache });
  const session = driver.createSession(schema);
  const db = new NeonHttpDatabase(
    dialect,
    session,
    schema
  );
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const instance = (0, import_serverless.neon)(params[0]);
    return construct(instance, params[1]);
  }
  if ((0, import_utils.isConfig)(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client) return construct(client, drizzleConfig);
    if (typeof connection === "object") {
      const { connectionString, ...options } = connection;
      const instance2 = (0, import_serverless.neon)(connectionString, options);
      return construct(instance2, drizzleConfig);
    }
    const instance = (0, import_serverless.neon)(connection);
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
  NeonHttpDatabase,
  NeonHttpDriver,
  drizzle
});
//# sourceMappingURL=driver.cjs.map