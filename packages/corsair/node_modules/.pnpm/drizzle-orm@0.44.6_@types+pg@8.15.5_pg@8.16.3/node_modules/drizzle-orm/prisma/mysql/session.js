import { entityKind } from "../../entity.js";
import { NoopLogger } from "../../logger.js";
import { MySqlPreparedQuery, MySqlSession } from "../../mysql-core/index.js";
import { fillPlaceholders } from "../../sql/sql.js";
class PrismaMySqlPreparedQuery extends MySqlPreparedQuery {
  constructor(prisma, query, logger) {
    super(void 0, void 0, void 0);
    this.prisma = prisma;
    this.query = query;
    this.logger = logger;
  }
  iterator(_placeholderValues) {
    throw new Error("Method not implemented.");
  }
  static [entityKind] = "PrismaMySqlPreparedQuery";
  execute(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.prisma.$queryRawUnsafe(this.query.sql, ...params);
  }
}
class PrismaMySqlSession extends MySqlSession {
  constructor(dialect, prisma, options) {
    super(dialect);
    this.prisma = prisma;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
  }
  static [entityKind] = "PrismaMySqlSession";
  logger;
  execute(query) {
    return this.prepareQuery(this.dialect.sqlToQuery(query)).execute();
  }
  all(_query) {
    throw new Error("Method not implemented.");
  }
  prepareQuery(query) {
    return new PrismaMySqlPreparedQuery(this.prisma, query, this.logger);
  }
  transaction(_transaction, _config) {
    throw new Error("Method not implemented.");
  }
}
export {
  PrismaMySqlPreparedQuery,
  PrismaMySqlSession
};
//# sourceMappingURL=session.js.map