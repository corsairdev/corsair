import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelIntColumnBaseBuilder } from "./int.common.js";
class GelSmallIntBuilder extends GelIntColumnBaseBuilder {
  static [entityKind] = "GelSmallIntBuilder";
  constructor(name) {
    super(name, "number", "GelSmallInt");
  }
  /** @internal */
  build(table) {
    return new GelSmallInt(table, this.config);
  }
}
class GelSmallInt extends GelColumn {
  static [entityKind] = "GelSmallInt";
  getSQLType() {
    return "smallint";
  }
}
function smallint(name) {
  return new GelSmallIntBuilder(name ?? "");
}
export {
  GelSmallInt,
  GelSmallIntBuilder,
  smallint
};
//# sourceMappingURL=smallint.js.map