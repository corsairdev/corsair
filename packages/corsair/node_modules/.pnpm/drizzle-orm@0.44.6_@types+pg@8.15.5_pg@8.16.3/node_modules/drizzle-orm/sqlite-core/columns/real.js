import { entityKind } from "../../entity.js";
import { SQLiteColumn, SQLiteColumnBuilder } from "./common.js";
class SQLiteRealBuilder extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteRealBuilder";
  constructor(name) {
    super(name, "number", "SQLiteReal");
  }
  /** @internal */
  build(table) {
    return new SQLiteReal(table, this.config);
  }
}
class SQLiteReal extends SQLiteColumn {
  static [entityKind] = "SQLiteReal";
  getSQLType() {
    return "real";
  }
}
function real(name) {
  return new SQLiteRealBuilder(name ?? "");
}
export {
  SQLiteReal,
  SQLiteRealBuilder,
  real
};
//# sourceMappingURL=real.js.map