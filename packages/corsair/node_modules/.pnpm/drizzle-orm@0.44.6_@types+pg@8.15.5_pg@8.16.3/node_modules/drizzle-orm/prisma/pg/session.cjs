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
  PrismaPgPreparedQuery: () => PrismaPgPreparedQuery,
  PrismaPgSession: () => PrismaPgSession
});
module.exports = __toCommonJS(session_exports);
var import_entity = require("../../entity.cjs");
var import_logger = require("../../logger.cjs");
var import_pg_core = require("../../pg-core/index.cjs");
var import_sql = require("../../sql/sql.cjs");
class PrismaPgPreparedQuery extends import_pg_core.PgPreparedQuery {
  constructor(prisma, query, logger) {
    super(query, void 0, void 0, void 0);
    this.prisma = prisma;
    this.logger = logger;
  }
  static [import_entity.entityKind] = "PrismaPgPreparedQuery";
  execute(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
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
class PrismaPgSession extends import_pg_core.PgSession {
  constructor(dialect, prisma, options) {
    super(dialect);
    this.prisma = prisma;
    this.options = options;
    this.logger = options.logger ?? new import_logger.NoopLogger();
  }
  static [import_entity.entityKind] = "PrismaPgSession";
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaPgPreparedQuery,
  PrismaPgSession
});
//# sourceMappingURL=session.cjs.map