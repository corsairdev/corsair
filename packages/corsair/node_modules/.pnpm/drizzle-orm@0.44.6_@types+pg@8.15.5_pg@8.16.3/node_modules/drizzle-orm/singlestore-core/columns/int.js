import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
class SingleStoreIntBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
  static [entityKind] = "SingleStoreIntBuilder";
  constructor(name, config) {
    super(name, "number", "SingleStoreInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new SingleStoreInt(
      table,
      this.config
    );
  }
}
class SingleStoreInt extends SingleStoreColumnWithAutoIncrement {
  static [entityKind] = "SingleStoreInt";
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
  return new SingleStoreIntBuilder(name, config);
}
export {
  SingleStoreInt,
  SingleStoreIntBuilder,
  int
};
//# sourceMappingURL=int.js.map