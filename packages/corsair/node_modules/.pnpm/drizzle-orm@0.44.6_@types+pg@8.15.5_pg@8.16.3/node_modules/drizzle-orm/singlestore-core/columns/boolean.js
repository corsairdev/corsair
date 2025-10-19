import { entityKind } from "../../entity.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreBooleanBuilder extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreBooleanBuilder";
  constructor(name) {
    super(name, "boolean", "SingleStoreBoolean");
  }
  /** @internal */
  build(table) {
    return new SingleStoreBoolean(
      table,
      this.config
    );
  }
}
class SingleStoreBoolean extends SingleStoreColumn {
  static [entityKind] = "SingleStoreBoolean";
  getSQLType() {
    return "boolean";
  }
  mapFromDriverValue(value) {
    if (typeof value === "boolean") {
      return value;
    }
    return value === 1;
  }
}
function boolean(name) {
  return new SingleStoreBooleanBuilder(name ?? "");
}
export {
  SingleStoreBoolean,
  SingleStoreBooleanBuilder,
  boolean
};
//# sourceMappingURL=boolean.js.map