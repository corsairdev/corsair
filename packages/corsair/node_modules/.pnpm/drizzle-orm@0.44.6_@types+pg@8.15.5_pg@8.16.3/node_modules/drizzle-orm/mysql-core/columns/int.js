import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
class MySqlIntBuilder extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlIntBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new MySqlInt(table, this.config);
  }
}
class MySqlInt extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlInt";
  getSQLType() {
    return `int${this.config.unsigned ? " unsigned" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function int(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlIntBuilder(name, config);
}
export {
  MySqlInt,
  MySqlIntBuilder,
  int
};
//# sourceMappingURL=int.js.map