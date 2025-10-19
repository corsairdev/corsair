import { Prisma } from "@prisma/client";
import { entityKind } from "../../entity.js";
import { DefaultLogger } from "../../logger.js";
import { PgDatabase, PgDialect } from "../../pg-core/index.js";
import { PrismaPgSession } from "./session.js";
class PrismaPgDatabase extends PgDatabase {
  static [entityKind] = "PrismaPgDatabase";
  constructor(client, logger) {
    const dialect = new PgDialect();
    super(dialect, new PrismaPgSession(dialect, client, { logger }), void 0);
  }
}
function drizzle(config = {}) {
  let logger;
  if (config.logger === true) {
    logger = new DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  return Prisma.defineExtension((client) => {
    return client.$extends({
      name: "drizzle",
      client: {
        $drizzle: new PrismaPgDatabase(client, logger)
      }
    });
  });
}
export {
  PrismaPgDatabase,
  drizzle
};
//# sourceMappingURL=driver.js.map