import { entityKind } from "../entity.js";
import { NoopLogger } from "../logger.js";
import { fillPlaceholders } from "../sql/sql.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import {
  SQLiteSession
} from "../sqlite-core/session.js";
import { SQLitePreparedQuery as PreparedQueryBase } from "../sqlite-core/session.js";
import { mapResultRow } from "../utils.js";
class SQLiteDOSession extends SQLiteSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new NoopLogger();
  }
  static [entityKind] = "SQLiteDOSession";
  logger;
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
    return new SQLiteDOPreparedQuery(
      this.client,
      query,
      this.logger,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  transaction(transaction, _config) {
    const tx = new SQLiteDOTransaction("sync", this.dialect, this, this.schema);
    this.client.transactionSync(() => {
      transaction(tx);
    });
    return {};
  }
}
class SQLiteDOTransaction extends SQLiteTransaction {
  static [entityKind] = "SQLiteDOTransaction";
  transaction(transaction) {
    const tx = new SQLiteDOTransaction("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.transaction(() => transaction(tx));
    return {};
  }
}
class SQLiteDOPreparedQuery extends PreparedQueryBase {
  constructor(client, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("sync", executeMethod, query, void 0, void 0, void 0);
    this.client = client;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [entityKind] = "SQLiteDOPreparedQuery";
  run(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    params.length > 0 ? this.client.sql.exec(this.query.sql, ...params) : this.client.sql.exec(this.query.sql);
  }
  all(placeholderValues) {
    const { fields, joinsNotNullableMap, query, logger, client, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return params.length > 0 ? client.sql.exec(query.sql, ...params).toArray() : client.sql.exec(query.sql).toArray();
    }
    const rows = this.values(placeholderValues);
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
  }
  get(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    const { fields, client, joinsNotNullableMap, customResultMapper, query } = this;
    if (!fields && !customResultMapper) {
      return (params.length > 0 ? client.sql.exec(query.sql, ...params) : client.sql.exec(query.sql)).next().value;
    }
    const rows = this.values(placeholderValues);
    const row = rows[0];
    if (!row) {
      return void 0;
    }
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return mapResultRow(fields, row, joinsNotNullableMap);
  }
  values(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    const res = params.length > 0 ? this.client.sql.exec(this.query.sql, ...params) : this.client.sql.exec(this.query.sql);
    return res.raw().toArray();
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
export {
  SQLiteDOPreparedQuery,
  SQLiteDOSession,
  SQLiteDOTransaction
};
//# sourceMappingURL=session.js.map