import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
class MySqlRealBuilder extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlRealBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlReal");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
  }
  /** @internal */
  build(table) {
    return new MySqlReal(table, this.config);
  }
}
class MySqlReal extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlReal";
  precision = this.config.precision;
  scale = this.config.scale;
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `real(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "real";
    } else {
      return `real(${this.precision})`;
    }
  }
}
function real(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlRealBuilder(name, config);
}
export {
  MySqlReal,
  MySqlRealBuilder,
  real
};
//# sourceMappingURL=real.js.map