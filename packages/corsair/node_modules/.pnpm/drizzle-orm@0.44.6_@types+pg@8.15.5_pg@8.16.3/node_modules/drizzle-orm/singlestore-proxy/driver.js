import { entityKind } from "../entity.js";
import { DefaultLogger } from "../logger.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../relations.js";
import { SingleStoreDatabase } from "../singlestore-core/db.js";
import { SingleStoreDialect } from "../singlestore-core/dialect.js";
import {
  SingleStoreRemoteSession
} from "./session.js";
class SingleStoreRemoteDatabase extends SingleStoreDatabase {
  static [entityKind] = "SingleStoreRemoteDatabase";
}
function drizzle(callback, config = {}) {
  const dialect = new SingleStoreDialect({ casing: config.casing });
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
  const session = new SingleStoreRemoteSession(callback, dialect, schema, { logger });
  return new SingleStoreRemoteDatabase(dialect, session, schema);
}
export {
  SingleStoreRemoteDatabase,
  drizzle
};
//# sourceMappingURL=driver.js.map