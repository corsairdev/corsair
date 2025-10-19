import { entityKind } from "../entity.js";
import { View } from "../sql/sql.js";
class MySqlViewBase extends View {
  static [entityKind] = "MySqlViewBase";
}
export {
  MySqlViewBase
};
//# sourceMappingURL=view-base.js.map