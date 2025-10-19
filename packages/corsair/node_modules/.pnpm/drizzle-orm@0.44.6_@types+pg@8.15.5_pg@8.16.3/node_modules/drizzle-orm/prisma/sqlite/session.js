import { entityKind } from "../../entity.js";
import { NoopLogger } from "../../logger.js";
import { fillPlaceholders } from "../../sql/sql.js";
import { SQLitePreparedQuery, SQLiteSession } from "../../sqlite-core/index.js";
class PrismaSQLitePreparedQuery extends SQLitePreparedQuery {
  constructor(prisma, query, logger, executeMethod) {
    super("async", executeMethod, query);
    this.prisma = prisma;
    this.logger = logger;
  }
  static [entityKind] = "PrismaSQLitePreparedQuery";
  all(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.prisma.$queryRawUnsafe(this.query.sql, ...params);
  }
  async run(placeholderValues) {
    await this.all(placeholderValues);
    return [];
  }
  async get(placeholderValues) {
    const all = await this.all(placeholderValues);
    return all[0];
  }
  values(_placeholderValues) {
    throw new Error("Method not implemented.");
  }
  isResponseInArrayMode() {
    return false;
  }
}
class PrismaSQLiteSession extends SQLiteSession {
  constructor(prisma, dialect, options) {
    super(dialect);
    this.prisma = prisma;
    this.logger = options.logger ?? new NoopLogger();
  }
  static [entityKind] = "PrismaSQLiteSession";
  logger;
  prepareQuery(query, fields, executeMethod) {
    return new PrismaSQLitePreparedQuery(this.prisma, query, this.logger, executeMethod);
  }
  transaction(_transaction, _config) {
    throw new Error("Method not implemented.");
  }
}
export {
  PrismaSQLitePreparedQuery,
  PrismaSQLiteSession
};
//# sourceMappingURL=session.js.map