import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
class MySqlSmallIntBuilder extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlSmallIntBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlSmallInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new MySqlSmallInt(
      table,
      this.config
    );
  }
}
class MySqlSmallInt extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlSmallInt";
  getSQLType() {
    return `smallint${this.config.unsigned ? " unsigned" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function smallint(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlSmallIntBuilder(name, config);
}
export {
  MySqlSmallInt,
  MySqlSmallIntBuilder,
  smallint
};
//# sourceMappingURL=smallint.js.map