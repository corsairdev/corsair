import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
class GelRealBuilder extends GelColumnBuilder {
  static [entityKind] = "GelRealBuilder";
  constructor(name, length) {
    super(name, "number", "GelReal");
    this.config.length = length;
  }
  /** @internal */
  build(table) {
    return new GelReal(table, this.config);
  }
}
class GelReal extends GelColumn {
  static [entityKind] = "GelReal";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "real";
  }
}
function real(name) {
  return new GelRealBuilder(name ?? "");
}
export {
  GelReal,
  GelRealBuilder,
  real
};
//# sourceMappingURL=real.js.map