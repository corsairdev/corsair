import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { entityKind, is } from "../../entity.js";
import { DefaultLogger } from "../../logger.js";
import { PgDatabase } from "../../pg-core/db.js";
import { PgDialect } from "../../pg-core/dialect.js";
import { PgArray } from "../../pg-core/index.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../../relations.js";
import { Param, sql } from "../../sql/sql.js";
import { Table } from "../../table.js";
import { AwsDataApiSession } from "./session.js";
class AwsDataApiPgDatabase extends PgDatabase {
  static [entityKind] = "AwsDataApiPgDatabase";
  execute(query) {
    return super.execute(query);
  }
}
class AwsPgDialect extends PgDialect {
  static [entityKind] = "AwsPgDialect";
  escapeParam(num) {
    return `:${num + 1}`;
  }
  buildInsertQuery({ table, values, onConflict, returning, select, withList }) {
    const columns = table[Table.Symbol.Columns];
    if (!select) {
      for (const value of values) {
        for (const fieldName of Object.keys(columns)) {
          const colValue = value[fieldName];
          if (is(colValue, Param) && colValue.value !== void 0 && is(colValue.encoder, PgArray) && Array.isArray(colValue.value)) {
            value[fieldName] = sql`cast(${colValue} as ${sql.raw(colValue.encoder.getSQLType())})`;
          }
        }
      }
    }
    return super.buildInsertQuery({ table, values, onConflict, returning, withList });
  }
  buildUpdateSet(table, set) {
    const columns = table[Table.Symbol.Columns];
    for (const [colName, colValue] of Object.entries(set)) {
      const currentColumn = columns[colName];
      if (currentColumn && is(colValue, Param) && colValue.value !== void 0 && is(colValue.encoder, PgArray) && Array.isArray(colValue.value)) {
        set[colName] = sql`cast(${colValue} as ${sql.raw(colValue.encoder.getSQLType())})`;
      }
    }
    return super.buildUpdateSet(table, set);
  }
}
function construct(client, config) {
  const dialect = new AwsPgDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  let schema;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new AwsDataApiSession(client, dialect, schema, { ...config, logger, cache: config.cache }, void 0);
  const db = new AwsDataApiPgDatabase(dialect, session, schema);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
function drizzle(...params) {
  if (params[0] instanceof RDSDataClient || params[0].constructor.name !== "Object") {
    return construct(params[0], params[1]);
  }
  if (params[0].client) {
    const { client, ...drizzleConfig2 } = params[0];
    return construct(client, drizzleConfig2);
  }
  const { connection, ...drizzleConfig } = params[0];
  const { resourceArn, database, secretArn, ...rdsConfig } = connection;
  const instance = new RDSDataClient(rdsConfig);
  return construct(instance, { resourceArn, database, secretArn, ...drizzleConfig });
}
((drizzle2) => {
  function mock(config) {
    return construct({}, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));
export {
  AwsDataApiPgDatabase,
  AwsPgDialect,
  drizzle
};
//# sourceMappingURL=driver.js.map