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
  PrismaMySqlPreparedQuery: () => PrismaMySqlPreparedQuery,
  PrismaMySqlSession: () => PrismaMySqlSession
});
module.exports = __toCommonJS(session_exports);
var import_entity = require("../../entity.cjs");
var import_logger = require("../../logger.cjs");
var import_mysql_core = require("../../mysql-core/index.cjs");
var import_sql = require("../../sql/sql.cjs");
class PrismaMySqlPreparedQuery extends import_mysql_core.MySqlPreparedQuery {
  constructor(prisma, query, logger) {
    super(void 0, void 0, void 0);
    this.prisma = prisma;
    this.query = query;
    this.logger = logger;
  }
  iterator(_placeholderValues) {
    throw new Error("Method not implemented.");
  }
  static [import_entity.entityKind] = "PrismaMySqlPreparedQuery";
  execute(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.prisma.$queryRawUnsafe(this.query.sql, ...params);
  }
}
class PrismaMySqlSession extends import_mysql_core.MySqlSession {
  constructor(dialect, prisma, options) {
    super(dialect);
    this.prisma = prisma;
    this.options = options;
    this.logger = options.logger ?? new import_logger.NoopLogger();
  }
  static [import_entity.entityKind] = "PrismaMySqlSession";
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaMySqlPreparedQuery,
  PrismaMySqlSession
});
//# sourceMappingURL=session.cjs.map