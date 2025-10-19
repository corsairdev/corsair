import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
class GelBooleanBuilder extends GelColumnBuilder {
  static [entityKind] = "GelBooleanBuilder";
  constructor(name) {
    super(name, "boolean", "GelBoolean");
  }
  /** @internal */
  build(table) {
    return new GelBoolean(table, this.config);
  }
}
class GelBoolean extends GelColumn {
  static [entityKind] = "GelBoolean";
  getSQLType() {
    return "boolean";
  }
}
function boolean(name) {
  return new GelBooleanBuilder(name ?? "");
}
export {
  GelBoolean,
  GelBooleanBuilder,
  boolean
};
//# sourceMappingURL=boolean.js.map