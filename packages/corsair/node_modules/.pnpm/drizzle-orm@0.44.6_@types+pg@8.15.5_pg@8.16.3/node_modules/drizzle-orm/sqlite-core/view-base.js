import { entityKind } from "../entity.js";
import { View } from "../sql/sql.js";
class SQLiteViewBase extends View {
  static [entityKind] = "SQLiteViewBase";
}
export {
  SQLiteViewBase
};
//# sourceMappingURL=view-base.js.map