import { connect } from "@tidbcloud/serverless";
import { entityKind } from "../entity.js";
import { DefaultLogger } from "../logger.js";
import { MySqlDatabase } from "../mysql-core/db.js";
import { MySqlDialect } from "../mysql-core/dialect.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../relations.js";
import { isConfig } from "../utils.js";
import { TiDBServerlessSession } from "./session.js";
class TiDBServerlessDatabase extends MySqlDatabase {
  static [entityKind] = "TiDBServerlessDatabase";
}
function construct(client, config = {}) {
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
  const session = new TiDBServerlessSession(client, dialect, void 0, schema, { logger, cache: config.cache });
  const db = new TiDBServerlessDatabase(dialect, session, schema, "default");
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const instance = connect({
      url: params[0]
    });
    return construct(instance, params[1]);
  }
  if (isConfig(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client) return construct(client, drizzleConfig);
    const instance = typeof connection === "string" ? connect({
      url: connection
    }) : connect(connection);
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
  TiDBServerlessDatabase,
  drizzle
};
//# sourceMappingURL=driver.js.map