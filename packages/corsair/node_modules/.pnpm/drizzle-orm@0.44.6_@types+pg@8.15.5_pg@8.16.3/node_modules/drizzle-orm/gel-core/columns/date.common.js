import { entityKind } from "../../entity.js";
import { sql } from "../../sql/sql.js";
import { GelColumnBuilder } from "./common.js";
class GelLocalDateColumnBaseBuilder extends GelColumnBuilder {
  static [entityKind] = "GelLocalDateColumnBaseBuilder";
  defaultNow() {
    return this.default(sql`now()`);
  }
}
export {
  GelLocalDateColumnBaseBuilder
};
//# sourceMappingURL=date.common.js.map