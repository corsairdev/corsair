import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
class MySqlDoubleBuilder extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlDoubleBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlDouble");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new MySqlDouble(table, this.config);
  }
}
class MySqlDouble extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlDouble";
  precision = this.config.precision;
  scale = this.config.scale;
  unsigned = this.config.unsigned;
  getSQLType() {
    let type = "";
    if (this.precision !== void 0 && this.scale !== void 0) {
      type += `double(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      type += "double";
    } else {
      type += `double(${this.precision})`;
    }
    return this.unsigned ? `${type} unsigned` : type;
  }
}
function double(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlDoubleBuilder(name, config);
}
export {
  MySqlDouble,
  MySqlDoubleBuilder,
  double
};
//# sourceMappingURL=double.js.map