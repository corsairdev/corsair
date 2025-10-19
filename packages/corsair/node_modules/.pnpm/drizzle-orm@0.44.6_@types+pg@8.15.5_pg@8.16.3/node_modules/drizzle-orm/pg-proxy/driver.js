import { entityKind } from "../entity.js";
import { DefaultLogger } from "../logger.js";
import { PgDatabase } from "../pg-core/db.js";
import { PgDialect } from "../pg-core/dialect.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../relations.js";
import { PgRemoteSession } from "./session.js";
class PgRemoteDatabase extends PgDatabase {
  static [entityKind] = "PgRemoteDatabase";
}
function drizzle(callback, config = {}, _dialect = () => new PgDialect({ casing: config.casing })) {
  const dialect = _dialect();
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
  const session = new PgRemoteSession(callback, dialect, schema, { logger, cache: config.cache });
  const db = new PgRemoteDatabase(dialect, session, schema);
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
export {
  PgRemoteDatabase,
  drizzle
};
//# sourceMappingURL=driver.js.map