import { entityKind } from "../entity.js";
import { DefaultLogger } from "../logger.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../relations.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { SQLiteSyncDialect } from "../sqlite-core/dialect.js";
import { SQLiteDOSession } from "./session.js";
class DrizzleSqliteDODatabase extends BaseSQLiteDatabase {
  static [entityKind] = "DrizzleSqliteDODatabase";
}
function drizzle(client, config = {}) {
  const dialect = new SQLiteSyncDialect({ casing: config.casing });
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
  const session = new SQLiteDOSession(client, dialect, schema, { logger });
  const db = new DrizzleSqliteDODatabase("sync", dialect, session, schema);
  db.$client = client;
  return db;
}
export {
  DrizzleSqliteDODatabase,
  drizzle
};
//# sourceMappingURL=driver.js.map