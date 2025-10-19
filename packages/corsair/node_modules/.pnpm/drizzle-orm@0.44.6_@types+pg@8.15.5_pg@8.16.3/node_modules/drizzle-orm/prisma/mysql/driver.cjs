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
var driver_exports = {};
__export(driver_exports, {
  PrismaMySqlDatabase: () => PrismaMySqlDatabase,
  drizzle: () => drizzle
});
module.exports = __toCommonJS(driver_exports);
var import_client = require("@prisma/client");
var import_entity = require("../../entity.cjs");
var import_logger = require("../../logger.cjs");
var import_mysql_core = require("../../mysql-core/index.cjs");
var import_session = require("./session.cjs");
class PrismaMySqlDatabase extends import_mysql_core.MySqlDatabase {
  static [import_entity.entityKind] = "PrismaMySqlDatabase";
  constructor(client, logger) {
    const dialect = new import_mysql_core.MySqlDialect();
    super(dialect, new import_session.PrismaMySqlSession(dialect, client, { logger }), void 0, "default");
  }
}
function drizzle(config = {}) {
  let logger;
  if (config.logger === true) {
    logger = new import_logger.DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  return import_client.Prisma.defineExtension((client) => {
    return client.$extends({
      name: "drizzle",
      client: {
        $drizzle: new PrismaMySqlDatabase(client, logger)
      }
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaMySqlDatabase,
  drizzle
});
//# sourceMappingURL=driver.cjs.map