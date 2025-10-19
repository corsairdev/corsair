import { neonConfig, Pool } from "@neondatabase/serverless";
import { entityKind } from "../entity.js";
import { DefaultLogger } from "../logger.js";
import { PgDatabase } from "../pg-core/db.js";
import { PgDialect } from "../pg-core/dialect.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../relations.js";
import { isConfig } from "../utils.js";
import { NeonSession } from "./session.js";
class NeonDriver {
  constructor(client, dialect, options = {}) {
    this.client = client;
    this.dialect = dialect;
    this.options = options;
  }
  static [entityKind] = "NeonDriver";
  createSession(schema) {
    return new NeonSession(this.client, this.dialect, schema, {
      logger: this.options.logger,
      cache: this.options.cache
    });
  }
}
class NeonDatabase extends PgDatabase {
  static [entityKind] = "NeonServerlessDatabase";
}
function construct(client, config = {}) {
  const dialect = new PgDialect({ casing: config.casing });
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
  const driver = new NeonDriver(client, dialect, { logger, cache: config.cache });
  const session = driver.createSession(schema);
  const db = new NeonDatabase(dialect, session, schema);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const instance = new Pool({
      connectionString: params[0]
    });
    return construct(instance, params[1]);
  }
  if (isConfig(params[0])) {
    const { connection, client, ws, ...drizzleConfig } = params[0];
    if (ws) {
      neonConfig.webSocketConstructor = ws;
    }
    if (client) return construct(client, drizzleConfig);
    const instance = typeof connection === "string" ? new Pool({
      connectionString: connection
    }) : new Pool(connection);
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
export {
  NeonDatabase,
  NeonDriver,
  drizzle
};
//# sourceMappingURL=driver.js.map