import { entityKind } from "../entity.js";
import { View } from "../sql/sql.js";
class PgViewBase extends View {
  static [entityKind] = "PgViewBase";
}
export {
  PgViewBase
};
//# sourceMappingURL=view-base.js.map