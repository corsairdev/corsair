import { entityKind } from "../../entity.js";
import { sql } from "../../sql/sql.js";
import { PgColumnBuilder } from "./common.js";
class PgDateColumnBaseBuilder extends PgColumnBuilder {
  static [entityKind] = "PgDateColumnBaseBuilder";
  defaultNow() {
    return this.default(sql`now()`);
  }
}
export {
  PgDateColumnBaseBuilder
};
//# sourceMappingURL=date.common.js.map