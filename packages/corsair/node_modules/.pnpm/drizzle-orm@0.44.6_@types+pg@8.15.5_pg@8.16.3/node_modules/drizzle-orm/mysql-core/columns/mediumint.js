import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
class MySqlMediumIntBuilder extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlMediumIntBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlMediumInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new MySqlMediumInt(
      table,
      this.config
    );
  }
}
class MySqlMediumInt extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlMediumInt";
  getSQLType() {
    return `mediumint${this.config.unsigned ? " unsigned" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function mediumint(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlMediumIntBuilder(name, config);
}
export {
  MySqlMediumInt,
  MySqlMediumIntBuilder,
  mediumint
};
//# sourceMappingURL=mediumint.js.map