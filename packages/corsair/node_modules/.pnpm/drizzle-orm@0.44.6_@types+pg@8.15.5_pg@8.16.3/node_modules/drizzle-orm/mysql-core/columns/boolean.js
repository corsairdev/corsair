import { entityKind } from "../../entity.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
class MySqlBooleanBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlBooleanBuilder";
  constructor(name) {
    super(name, "boolean", "MySqlBoolean");
  }
  /** @internal */
  build(table) {
    return new MySqlBoolean(
      table,
      this.config
    );
  }
}
class MySqlBoolean extends MySqlColumn {
  static [entityKind] = "MySqlBoolean";
  getSQLType() {
    return "boolean";
  }
  mapFromDriverValue(value) {
    if (typeof value === "boolean") {
      return value;
    }
    return value === 1;
  }
}
function boolean(name) {
  return new MySqlBooleanBuilder(name ?? "");
}
export {
  MySqlBoolean,
  MySqlBooleanBuilder,
  boolean
};
//# sourceMappingURL=boolean.js.map