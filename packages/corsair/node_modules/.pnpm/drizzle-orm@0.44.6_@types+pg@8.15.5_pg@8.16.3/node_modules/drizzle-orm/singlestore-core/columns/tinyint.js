import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
class SingleStoreTinyIntBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
  static [entityKind] = "SingleStoreTinyIntBuilder";
  constructor(name, config) {
    super(name, "number", "SingleStoreTinyInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new SingleStoreTinyInt(
      table,
      this.config
    );
  }
}
class SingleStoreTinyInt extends SingleStoreColumnWithAutoIncrement {
  static [entityKind] = "SingleStoreTinyInt";
  getSQLType() {
    return `tinyint${this.config.unsigned ? " unsigned" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function tinyint(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new SingleStoreTinyIntBuilder(name, config);
}
export {
  SingleStoreTinyInt,
  SingleStoreTinyIntBuilder,
  tinyint
};
//# sourceMappingURL=tinyint.js.map