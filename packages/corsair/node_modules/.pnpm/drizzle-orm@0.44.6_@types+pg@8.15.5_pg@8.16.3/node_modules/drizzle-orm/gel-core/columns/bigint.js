import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelIntColumnBaseBuilder } from "./int.common.js";
class GelInt53Builder extends GelIntColumnBaseBuilder {
  static [entityKind] = "GelInt53Builder";
  constructor(name) {
    super(name, "number", "GelInt53");
  }
  /** @internal */
  build(table) {
    return new GelInt53(table, this.config);
  }
}
class GelInt53 extends GelColumn {
  static [entityKind] = "GelInt53";
  getSQLType() {
    return "bigint";
  }
}
function bigint(name) {
  return new GelInt53Builder(name ?? "");
}
export {
  GelInt53,
  GelInt53Builder,
  bigint
};
//# sourceMappingURL=bigint.js.map