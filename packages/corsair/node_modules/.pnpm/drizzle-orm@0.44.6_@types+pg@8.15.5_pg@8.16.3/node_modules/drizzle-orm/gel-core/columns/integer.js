import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelIntColumnBaseBuilder } from "./int.common.js";
class GelIntegerBuilder extends GelIntColumnBaseBuilder {
  static [entityKind] = "GelIntegerBuilder";
  constructor(name) {
    super(name, "number", "GelInteger");
  }
  /** @internal */
  build(table) {
    return new GelInteger(table, this.config);
  }
}
class GelInteger extends GelColumn {
  static [entityKind] = "GelInteger";
  getSQLType() {
    return "integer";
  }
}
function integer(name) {
  return new GelIntegerBuilder(name ?? "");
}
export {
  GelInteger,
  GelIntegerBuilder,
  integer
};
//# sourceMappingURL=integer.js.map