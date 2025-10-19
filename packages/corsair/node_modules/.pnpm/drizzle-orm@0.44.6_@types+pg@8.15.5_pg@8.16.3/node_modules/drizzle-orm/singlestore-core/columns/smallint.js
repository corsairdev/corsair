import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
class SingleStoreSmallIntBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
  static [entityKind] = "SingleStoreSmallIntBuilder";
  constructor(name, config) {
    super(name, "number", "SingleStoreSmallInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new SingleStoreSmallInt(
      table,
      this.config
    );
  }
}
class SingleStoreSmallInt extends SingleStoreColumnWithAutoIncrement {
  static [entityKind] = "SingleStoreSmallInt";
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
  return new SingleStoreSmallIntBuilder(name, config);
}
export {
  SingleStoreSmallInt,
  SingleStoreSmallIntBuilder,
  smallint
};
//# sourceMappingURL=smallint.js.map