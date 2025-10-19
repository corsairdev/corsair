import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
class GelDecimalBuilder extends GelColumnBuilder {
  static [entityKind] = "GelDecimalBuilder";
  constructor(name) {
    super(name, "string", "GelDecimal");
  }
  /** @internal */
  build(table) {
    return new GelDecimal(table, this.config);
  }
}
class GelDecimal extends GelColumn {
  static [entityKind] = "GelDecimal";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "numeric";
  }
}
function decimal(name) {
  return new GelDecimalBuilder(name ?? "");
}
export {
  GelDecimal,
  GelDecimalBuilder,
  decimal
};
//# sourceMappingURL=decimal.js.map