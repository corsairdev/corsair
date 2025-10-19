import { createPool } from "mysql2";
import { entityKind } from "../entity.js";
import { DefaultLogger } from "../logger.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../relations.js";
import { SingleStoreDatabase } from "../singlestore-core/db.js";
import { SingleStoreDialect } from "../singlestore-core/dialect.js";
import { isConfig } from "../utils.js";
import { npmVersion } from "../version.js";
import { SingleStoreDriverSession } from "./session.js";
class SingleStoreDriverDriver {
  constructor(client, dialect, options = {}) {
    this.client = client;
    this.dialect = dialect;
    this.options = options;
  }
  static [entityKind] = "SingleStoreDriverDriver";
  createSession(schema) {
    return new SingleStoreDriverSession(this.client, this.dialect, schema, {
      logger: this.options.logger,
      cache: this.options.cache
    });
  }
}
import { SingleStoreDatabase as SingleStoreDatabase2 } from "../singlestore-core/db.js";
class SingleStoreDriverDatabase extends SingleStoreDatabase {
  static [entityKind] = "SingleStoreDriverDatabase";
}
function construct(client, config = {}) {
  const dialect = new SingleStoreDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  const clientForInstance = isCallbackClient(client) ? client.promise() : client;
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
  const driver = new SingleStoreDriverDriver(clientForInstance, dialect, {
    logger,
    cache: config.cache
  });
  const session = driver.createSession(schema);
  const db = new SingleStoreDriverDatabase(dialect, session, schema);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
function isCallbackClient(client) {
  return typeof client.promise === "function";
}
const CONNECTION_ATTRS = {
  _connector_name: "SingleStore Drizzle ORM Driver",
  _connector_version: npmVersion
};
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const connectionString = params[0];
    const instance = createPool({
      uri: connectionString,
      connectAttributes: CONNECTION_ATTRS
    });
    return construct(instance, params[1]);
  }
  if (isConfig(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client) return construct(client, drizzleConfig);
    let opts = {};
    opts = typeof connection === "string" ? {
      uri: connection,
      supportBigNumbers: true,
      connectAttributes: CONNECTION_ATTRS
    } : {
      ...connection,
      connectAttributes: {
        ...connection.connectAttributes,
        ...CONNECTION_ATTRS
      }
    };
    const instance = createPool(opts);
    const db = construct(instance, drizzleConfig);
    return db;
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
  SingleStoreDatabase2 as SingleStoreDatabase,
  SingleStoreDriverDatabase,
  SingleStoreDriverDriver,
  drizzle
};
//# sourceMappingURL=driver.js.map