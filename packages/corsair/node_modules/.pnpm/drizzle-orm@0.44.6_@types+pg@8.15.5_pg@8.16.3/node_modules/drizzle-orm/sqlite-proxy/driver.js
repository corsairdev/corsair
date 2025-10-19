import { entityKind } from "../entity.js";
import { DefaultLogger } from "../logger.js";
import { createTableRelationsHelpers, extractTablesRelationalConfig } from "../relations.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { SQLiteAsyncDialect } from "../sqlite-core/dialect.js";
import { SQLiteRemoteSession } from "./session.js";
class SqliteRemoteDatabase extends BaseSQLiteDatabase {
  static [entityKind] = "SqliteRemoteDatabase";
  async batch(batch) {
    return this.session.batch(batch);
  }
}
function drizzle(callback, batchCallback, config) {
  const dialect = new SQLiteAsyncDialect({ casing: config?.casing });
  let logger;
  let cache;
  let _batchCallback;
  let _config = {};
  if (batchCallback) {
    if (typeof batchCallback === "function") {
      _batchCallback = batchCallback;
      _config = config ?? {};
    } else {
      _batchCallback = void 0;
      _config = batchCallback;
    }
    if (_config.logger === true) {
      logger = new DefaultLogger();
    } else if (_config.logger !== false) {
      logger = _config.logger;
      cache = _config.cache;
    }
  }
  let schema;
  if (_config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      _config.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: _config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new SQLiteRemoteSession(callback, dialect, schema, _batchCallback, { logger, cache });
  const db = new SqliteRemoteDatabase("async", dialect, session, schema);
  db.$cache = cache;
  if (db.$cache) {
    db.$cache["invalidate"] = cache?.onMutate;
  }
  return db;
}
export {
  SqliteRemoteDatabase,
  drizzle
};
//# sourceMappingURL=driver.js.map