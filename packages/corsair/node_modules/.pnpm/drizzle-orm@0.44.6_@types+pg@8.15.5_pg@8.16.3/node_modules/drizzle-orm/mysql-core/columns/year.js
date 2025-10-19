import { entityKind } from "../../entity.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
class MySqlYearBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlYearBuilder";
  constructor(name) {
    super(name, "number", "MySqlYear");
  }
  /** @internal */
  build(table) {
    return new MySqlYear(table, this.config);
  }
}
class MySqlYear extends MySqlColumn {
  static [entityKind] = "MySqlYear";
  getSQLType() {
    return `year`;
  }
}
function year(name) {
  return new MySqlYearBuilder(name ?? "");
}
export {
  MySqlYear,
  MySqlYearBuilder,
  year
};
//# sourceMappingURL=year.js.map