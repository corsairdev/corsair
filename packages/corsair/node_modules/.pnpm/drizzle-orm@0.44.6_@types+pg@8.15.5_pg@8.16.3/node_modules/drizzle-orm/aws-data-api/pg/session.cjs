"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var session_exports = {};
__export(session_exports, {
  AwsDataApiPreparedQuery: () => AwsDataApiPreparedQuery,
  AwsDataApiSession: () => AwsDataApiSession,
  AwsDataApiTransaction: () => AwsDataApiTransaction
});
module.exports = __toCommonJS(session_exports);
var import_client_rds_data = require("@aws-sdk/client-rds-data");
var import_cache = require("../../cache/core/cache.cjs");
var import_entity = require("../../entity.cjs");
var import_pg_core = require("../../pg-core/index.cjs");
var import_sql = require("../../sql/sql.cjs");
var import_utils = require("../../utils.cjs");
var import_common = require("../common/index.cjs");
class AwsDataApiPreparedQuery extends import_pg_core.PgPreparedQuery {
  constructor(client, queryString, params, typings, options, cache, queryMetadata, cacheConfig, fields, transactionId, _isResponseInArrayMode, customResultMapper) {
    super({ sql: queryString, params }, cache, queryMetadata, cacheConfig);
    this.client = client;
    this.queryString = queryString;
    this.params = params;
    this.typings = typings;
    this.options = options;
    this.fields = fields;
    this.transactionId = transactionId;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
    this.rawQuery = new import_client_rds_data.ExecuteStatementCommand({
      sql: queryString,
      parameters: [],
      secretArn: options.secretArn,
      resourceArn: options.resourceArn,
      database: options.database,
      transactionId,
      includeResultMetadata: !fields && !customResultMapper
    });
  }
  static [import_entity.entityKind] = "AwsDataApiPreparedQuery";
  rawQuery;
  async execute(placeholderValues = {}) {
    const { fields, joinsNotNullableMap, customResultMapper } = this;
    const result = await this.values(placeholderValues);
    if (!fields && !customResultMapper) {
      const { columnMetadata, rows } = result;
      if (!columnMetadata) {
        return result;
      }
      const mappedRows = rows.map((sourceRow) => {
        const row = {};
        for (const [index, value] of sourceRow.entries()) {
          const metadata = columnMetadata[index];
          if (!metadata) {
            throw new Error(
              `Unexpected state: no column metadata found for index ${index}. Please report this issue on GitHub: https://github.com/drizzle-team/drizzle-orm/issues/new/choose`
            );
          }
          if (!metadata.name) {
            throw new Error(
              `Unexpected state: no column name for index ${index} found in the column metadata. Please report this issue on GitHub: https://github.com/drizzle-team/drizzle-orm/issues/new/choose`
            );
          }
          row[metadata.name] = value;
        }
        return row;
      });
      return Object.assign(result, { rows: mappedRows });
    }
    return customResultMapper ? customResultMapper(result.rows) : result.rows.map((row) => (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap));
  }
  async all(placeholderValues) {
    const result = await this.execute(placeholderValues);
    if (!this.fields && !this.customResultMapper) {
      return result.rows;
    }
    return result;
  }
  async values(placeholderValues = {}) {
    const params = (0, import_sql.fillPlaceholders)(this.params, placeholderValues ?? {});
    this.rawQuery.input.parameters = params.map((param, index) => ({
      name: `${index + 1}`,
      ...(0, import_common.toValueParam)(param, this.typings[index])
    }));
    this.options.logger?.logQuery(this.rawQuery.input.sql, this.rawQuery.input.parameters);
    const result = await this.queryWithCache(this.queryString, params, async () => {
      return await this.client.send(this.rawQuery);
    });
    const rows = result.records?.map((row) => {
      return row.map((field) => (0, import_common.getValueFromDataApi)(field));
    }) ?? [];
    return {
      ...result,
      rows
    };
  }
  /** @internal */
  mapResultRows(records, columnMetadata) {
    return records.map((record) => {
      const row = {};
      for (const [index, field] of record.entries()) {
        const { name } = columnMetadata[index];
        row[name ?? index] = (0, import_common.getValueFromDataApi)(field);
      }
      return row;
    });
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
class AwsDataApiSession extends import_pg_core.PgSession {
  constructor(client, dialect, schema, options, transactionId) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.transactionId = transactionId;
    this.rawQuery = {
      secretArn: options.secretArn,
      resourceArn: options.resourceArn,
      database: options.database
    };
    this.cache = options.cache ?? new import_cache.NoopCache();
  }
  static [import_entity.entityKind] = "AwsDataApiSession";
  /** @internal */
  rawQuery;
  cache;
  prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig, transactionId) {
    return new AwsDataApiPreparedQuery(
      this.client,
      query.sql,
      query.params,
      query.typings ?? [],
      this.options,
      this.cache,
      queryMetadata,
      cacheConfig,
      fields,
      transactionId ?? this.transactionId,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  execute(query) {
    return this.prepareQuery(
      this.dialect.sqlToQuery(query),
      void 0,
      void 0,
      false,
      void 0,
      void 0,
      void 0,
      this.transactionId
    ).execute();
  }
  async transaction(transaction, config) {
    const { transactionId } = await this.client.send(new import_client_rds_data.BeginTransactionCommand(this.rawQuery));
    const session = new AwsDataApiSession(this.client, this.dialect, this.schema, this.options, transactionId);
    const tx = new AwsDataApiTransaction(this.dialect, session, this.schema);
    if (config) {
      await tx.setTransaction(config);
    }
    try {
      const result = await transaction(tx);
      await this.client.send(new import_client_rds_data.CommitTransactionCommand({ ...this.rawQuery, transactionId }));
      return result;
    } catch (e) {
      await this.client.send(new import_client_rds_data.RollbackTransactionCommand({ ...this.rawQuery, transactionId }));
      throw e;
    }
  }
}
class AwsDataApiTransaction extends import_pg_core.PgTransaction {
  static [import_entity.entityKind] = "AwsDataApiTransaction";
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex + 1}`;
    const tx = new AwsDataApiTransaction(
      this.dialect,
      this.session,
      this.schema,
      this.nestedIndex + 1
    );
    await this.session.execute(import_sql.sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await this.session.execute(import_sql.sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (e) {
      await this.session.execute(import_sql.sql.raw(`rollback to savepoint ${savepointName}`));
      throw e;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AwsDataApiPreparedQuery,
  AwsDataApiSession,
  AwsDataApiTransaction
});
//# sourceMappingURL=session.cjs.map