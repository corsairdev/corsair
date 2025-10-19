import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
class SingleStoreRealBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
  static [entityKind] = "SingleStoreRealBuilder";
  constructor(name, config) {
    super(name, "number", "SingleStoreReal");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
  }
  /** @internal */
  build(table) {
    return new SingleStoreReal(
      table,
      this.config
    );
  }
}
class SingleStoreReal extends SingleStoreColumnWithAutoIncrement {
  static [entityKind] = "SingleStoreReal";
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
  return new SingleStoreRealBuilder(name, config);
}
export {
  SingleStoreReal,
  SingleStoreRealBuilder,
  real
};
//# sourceMappingURL=real.js.map