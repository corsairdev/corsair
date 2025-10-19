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
  AwsDataApiPgDatabase: () => AwsDataApiPgDatabase,
  AwsPgDialect: () => AwsPgDialect,
  drizzle: () => drizzle
});
module.exports = __toCommonJS(driver_exports);
var import_client_rds_data = require("@aws-sdk/client-rds-data");
var import_entity = require("../../entity.cjs");
var import_logger = require("../../logger.cjs");
var import_db = require("../../pg-core/db.cjs");
var import_dialect = require("../../pg-core/dialect.cjs");
var import_pg_core = require("../../pg-core/index.cjs");
var import_relations = require("../../relations.cjs");
var import_sql = require("../../sql/sql.cjs");
var import_table = require("../../table.cjs");
var import_session = require("./session.cjs");
class AwsDataApiPgDatabase extends import_db.PgDatabase {
  static [import_entity.entityKind] = "AwsDataApiPgDatabase";
  execute(query) {
    return super.execute(query);
  }
}
class AwsPgDialect extends import_dialect.PgDialect {
  static [import_entity.entityKind] = "AwsPgDialect";
  escapeParam(num) {
    return `:${num + 1}`;
  }
  buildInsertQuery({ table, values, onConflict, returning, select, withList }) {
    const columns = table[import_table.Table.Symbol.Columns];
    if (!select) {
      for (const value of values) {
        for (const fieldName of Object.keys(columns)) {
          const colValue = value[fieldName];
          if ((0, import_entity.is)(colValue, import_sql.Param) && colValue.value !== void 0 && (0, import_entity.is)(colValue.encoder, import_pg_core.PgArray) && Array.isArray(colValue.value)) {
            value[fieldName] = import_sql.sql`cast(${colValue} as ${import_sql.sql.raw(colValue.encoder.getSQLType())})`;
          }
        }
      }
    }
    return super.buildInsertQuery({ table, values, onConflict, returning, withList });
  }
  buildUpdateSet(table, set) {
    const columns = table[import_table.Table.Symbol.Columns];
    for (const [colName, colValue] of Object.entries(set)) {
      const currentColumn = columns[colName];
      if (currentColumn && (0, import_entity.is)(colValue, import_sql.Param) && colValue.value !== void 0 && (0, import_entity.is)(colValue.encoder, import_pg_core.PgArray) && Array.isArray(colValue.value)) {
        set[colName] = import_sql.sql`cast(${colValue} as ${import_sql.sql.raw(colValue.encoder.getSQLType())})`;
      }
    }
    return super.buildUpdateSet(table, set);
  }
}
function construct(client, config) {
  const dialect = new AwsPgDialect({ casing: config.casing });
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
  const session = new import_session.AwsDataApiSession(client, dialect, schema, { ...config, logger, cache: config.cache }, void 0);
  const db = new AwsDataApiPgDatabase(dialect, session, schema);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
function drizzle(...params) {
  if (params[0] instanceof import_client_rds_data.RDSDataClient || params[0].constructor.name !== "Object") {
    return construct(params[0], params[1]);
  }
  if (params[0].client) {
    const { client, ...drizzleConfig2 } = params[0];
    return construct(client, drizzleConfig2);
  }
  const { connection, ...drizzleConfig } = params[0];
  const { resourceArn, database, secretArn, ...rdsConfig } = connection;
  const instance = new import_client_rds_data.RDSDataClient(rdsConfig);
  return construct(instance, { resourceArn, database, secretArn, ...drizzleConfig });
}
((drizzle2) => {
  function mock(config) {
    return construct({}, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AwsDataApiPgDatabase,
  AwsPgDialect,
  drizzle
});
//# sourceMappingURL=driver.cjs.map