import { entityKind } from "../entity.js";
import { DefaultLogger } from "../logger.js";
import { MySqlDatabase } from "../mysql-core/db.js";
import { MySqlDialect } from "../mysql-core/dialect.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../relations.js";
import { MySqlRemoteSession } from "./session.js";
class MySqlRemoteDatabase extends MySqlDatabase {
  static [entityKind] = "MySqlRemoteDatabase";
}
function drizzle(callback, config = {}) {
  const dialect = new MySqlDialect({ casing: config.casing });
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
  const session = new MySqlRemoteSession(callback, dialect, schema, { logger });
  return new MySqlRemoteDatabase(dialect, session, schema, "default");
}
export {
  MySqlRemoteDatabase,
  drizzle
};
//# sourceMappingURL=driver.js.map