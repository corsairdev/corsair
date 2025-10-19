import { sql } from "@vercel/postgres";
import { entityKind } from "../entity.js";
import { DefaultLogger } from "../logger.js";
import { PgDatabase } from "../pg-core/db.js";
import { PgDialect } from "../pg-core/index.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../relations.js";
import { isConfig } from "../utils.js";
import { VercelPgSession } from "./session.js";
class VercelPgDriver {
  constructor(client, dialect, options = {}) {
    this.client = client;
    this.dialect = dialect;
    this.options = options;
  }
  static [entityKind] = "VercelPgDriver";
  createSession(schema) {
    return new VercelPgSession(this.client, this.dialect, schema, {
      logger: this.options.logger,
      cache: this.options.cache
    });
  }
}
class VercelPgDatabase extends PgDatabase {
  static [entityKind] = "VercelPgDatabase";
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
  const driver = new VercelPgDriver(client, dialect, { logger, cache: config.cache });
  const session = driver.createSession(schema);
  const db = new VercelPgDatabase(dialect, session, schema);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
function drizzle(...params) {
  if (isConfig(params[0])) {
    const { client, ...drizzleConfig } = params[0];
    return construct(client ?? sql, drizzleConfig);
  }
  return construct(params[0] ?? sql, params[1]);
}
((drizzle2) => {
  function mock(config) {
    return construct({}, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));
export {
  VercelPgDatabase,
  VercelPgDriver,
  drizzle
};
//# sourceMappingURL=driver.js.map