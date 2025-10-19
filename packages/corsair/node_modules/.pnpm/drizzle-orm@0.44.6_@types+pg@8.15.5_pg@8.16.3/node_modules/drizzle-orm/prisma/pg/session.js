import { entityKind } from "../../entity.js";
import { NoopLogger } from "../../logger.js";
import { PgPreparedQuery, PgSession } from "../../pg-core/index.js";
import { fillPlaceholders } from "../../sql/sql.js";
class PrismaPgPreparedQuery extends PgPreparedQuery {
  constructor(prisma, query, logger) {
    super(query, void 0, void 0, void 0);
    this.prisma = prisma;
    this.logger = logger;
  }
  static [entityKind] = "PrismaPgPreparedQuery";
  execute(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.prisma.$queryRawUnsafe(this.query.sql, ...params);
  }
  all() {
    throw new Error("Method not implemented.");
  }
  isResponseInArrayMode() {
    return false;
  }
}
class PrismaPgSession extends PgSession {
  constructor(dialect, prisma, options) {
    super(dialect);
    this.prisma = prisma;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
  }
  static [entityKind] = "PrismaPgSession";
  logger;
  execute(query) {
    return this.prepareQuery(this.dialect.sqlToQuery(query)).execute();
  }
  prepareQuery(query) {
    return new PrismaPgPreparedQuery(this.prisma, query, this.logger);
  }
  transaction(_transaction, _config) {
    throw new Error("Method not implemented.");
  }
}
export {
  PrismaPgPreparedQuery,
  PrismaPgSession
};
//# sourceMappingURL=session.js.map