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
  PrismaSQLitePreparedQuery: () => PrismaSQLitePreparedQuery,
  PrismaSQLiteSession: () => PrismaSQLiteSession
});
module.exports = __toCommonJS(session_exports);
var import_entity = require("../../entity.cjs");
var import_logger = require("../../logger.cjs");
var import_sql = require("../../sql/sql.cjs");
var import_sqlite_core = require("../../sqlite-core/index.cjs");
class PrismaSQLitePreparedQuery extends import_sqlite_core.SQLitePreparedQuery {
  constructor(prisma, query, logger, executeMethod) {
    super("async", executeMethod, query);
    this.prisma = prisma;
    this.logger = logger;
  }
  static [import_entity.entityKind] = "PrismaSQLitePreparedQuery";
  all(placeholderValues) {
    const params = (0, import_sql.fillPlaceholders)(this.query.params, placeholderValues ?? {});
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
class PrismaSQLiteSession extends import_sqlite_core.SQLiteSession {
  constructor(prisma, dialect, options) {
    super(dialect);
    this.prisma = prisma;
    this.logger = options.logger ?? new import_logger.NoopLogger();
  }
  static [import_entity.entityKind] = "PrismaSQLiteSession";
  logger;
  prepareQuery(query, fields, executeMethod) {
    return new PrismaSQLitePreparedQuery(this.prisma, query, this.logger, executeMethod);
  }
  transaction(_transaction, _config) {
    throw new Error("Method not implemented.");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaSQLitePreparedQuery,
  PrismaSQLiteSession
});
//# sourceMappingURL=session.cjs.map