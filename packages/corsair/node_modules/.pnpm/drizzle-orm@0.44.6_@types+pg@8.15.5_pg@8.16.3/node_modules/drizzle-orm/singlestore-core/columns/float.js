import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
class SingleStoreFloatBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
  static [entityKind] = "SingleStoreFloatBuilder";
  constructor(name, config) {
    super(name, "number", "SingleStoreFloat");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new SingleStoreFloat(
      table,
      this.config
    );
  }
}
class SingleStoreFloat extends SingleStoreColumnWithAutoIncrement {
  static [entityKind] = "SingleStoreFloat";
  precision = this.config.precision;
  scale = this.config.scale;
  unsigned = this.config.unsigned;
  getSQLType() {
    let type = "";
    if (this.precision !== void 0 && this.scale !== void 0) {
      type += `float(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      type += "float";
    } else {
      type += `float(${this.precision},0)`;
    }
    return this.unsigned ? `${type} unsigned` : type;
  }
}
function float(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new SingleStoreFloatBuilder(name, config);
}
export {
  SingleStoreFloat,
  SingleStoreFloatBuilder,
  float
};
//# sourceMappingURL=float.js.map