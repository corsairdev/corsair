import { hashQuery, NoopCache } from "../cache/core/cache.js";
import { entityKind, is } from "../entity.js";
import { DrizzleQueryError, TransactionRollbackError } from "../errors.js";
import { sql } from "../sql/sql.js";
import { MySqlDatabase } from "./db.js";
class MySqlPreparedQuery {
  constructor(cache, queryMetadata, cacheConfig) {
    this.cache = cache;
    this.queryMetadata = queryMetadata;
    this.cacheConfig = cacheConfig;
    if (cache && cache.strategy() === "all" && cacheConfig === void 0) {
      this.cacheConfig = { enable: true, autoInvalidate: true };
    }
    if (!this.cacheConfig?.enable) {
      this.cacheConfig = void 0;
    }
  }
  static [entityKind] = "MySqlPreparedQuery";
  /** @internal */
  async queryWithCache(queryString, params, query) {
    if (this.cache === void 0 || is(this.cache, NoopCache) || this.queryMetadata === void 0) {
      try {
        return await query();
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if (this.cacheConfig && !this.cacheConfig.enable) {
      try {
        return await query();
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0) {
      try {
        const [res] = await Promise.all([
          query(),
          this.cache.onMutate({ tables: this.queryMetadata.tables })
        ]);
        return res;
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if (!this.cacheConfig) {
      try {
        return await query();
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if (this.queryMetadata.type === "select") {
      const fromCache = await this.cache.get(
        this.cacheConfig.tag ?? (await hashQuery(queryString, params)),
        this.queryMetadata.tables,
        this.cacheConfig.tag !== void 0,
        this.cacheConfig.autoInvalidate
      );
      if (fromCache === void 0) {
        let result;
        try {
          result = await query();
        } catch (e) {
          throw new DrizzleQueryError(queryString, params, e);
        }
        await this.cache.put(
          this.cacheConfig.tag ?? (await hashQuery(queryString, params)),
          result,
          // make sure we send tables that were used in a query only if user wants to invalidate it on each write
          this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [],
          this.cacheConfig.tag !== void 0,
          this.cacheConfig.config
        );
        return result;
      }
      return fromCache;
    }
    try {
      return await query();
    } catch (e) {
      throw new DrizzleQueryError(queryString, params, e);
    }
  }
  /** @internal */
  joinsNotNullableMap;
}
class MySqlSession {
  constructor(dialect) {
    this.dialect = dialect;
  }
  static [entityKind] = "MySqlSession";
  execute(query) {
    return this.prepareQuery(
      this.dialect.sqlToQuery(query),
      void 0
    ).execute();
  }
  async count(sql2) {
    const res = await this.execute(sql2);
    return Number(
      res[0][0]["count"]
    );
  }
  getSetTransactionSQL(config) {
    const parts = [];
    if (config.isolationLevel) {
      parts.push(`isolation level ${config.isolationLevel}`);
    }
    return parts.length ? sql`set transaction ${sql.raw(parts.join(" "))}` : void 0;
  }
  getStartTransactionSQL(config) {
    const parts = [];
    if (config.withConsistentSnapshot) {
      parts.push("with consistent snapshot");
    }
    if (config.accessMode) {
      parts.push(config.accessMode);
    }
    return parts.length ? sql`start transaction ${sql.raw(parts.join(" "))}` : void 0;
  }
}
class MySqlTransaction extends MySqlDatabase {
  constructor(dialect, session, schema, nestedIndex, mode) {
    super(dialect, session, schema, mode);
    this.schema = schema;
    this.nestedIndex = nestedIndex;
  }
  static [entityKind] = "MySqlTransaction";
  rollback() {
    throw new TransactionRollbackError();
  }
}
export {
  MySqlPreparedQuery,
  MySqlSession,
  MySqlTransaction
};
//# sourceMappingURL=session.js.map