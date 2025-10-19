import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
class SingleStoreMediumIntBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
  static [entityKind] = "SingleStoreMediumIntBuilder";
  constructor(name, config) {
    super(name, "number", "SingleStoreMediumInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new SingleStoreMediumInt(
      table,
      this.config
    );
  }
}
class SingleStoreMediumInt extends SingleStoreColumnWithAutoIncrement {
  static [entityKind] = "SingleStoreMediumInt";
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
  return new SingleStoreMediumIntBuilder(name, config);
}
export {
  SingleStoreMediumInt,
  SingleStoreMediumIntBuilder,
  mediumint
};
//# sourceMappingURL=mediumint.js.map