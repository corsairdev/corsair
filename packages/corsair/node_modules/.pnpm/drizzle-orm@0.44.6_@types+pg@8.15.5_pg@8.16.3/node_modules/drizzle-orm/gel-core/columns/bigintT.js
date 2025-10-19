import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelIntColumnBaseBuilder } from "./int.common.js";
class GelBigInt64Builder extends GelIntColumnBaseBuilder {
  static [entityKind] = "GelBigInt64Builder";
  constructor(name) {
    super(name, "bigint", "GelBigInt64");
  }
  /** @internal */
  build(table) {
    return new GelBigInt64(
      table,
      this.config
    );
  }
}
class GelBigInt64 extends GelColumn {
  static [entityKind] = "GelBigInt64";
  getSQLType() {
    return "edgedbt.bigint_t";
  }
  mapFromDriverValue(value) {
    return BigInt(value);
  }
}
function bigintT(name) {
  return new GelBigInt64Builder(name ?? "");
}
export {
  GelBigInt64,
  GelBigInt64Builder,
  bigintT
};
//# sourceMappingURL=bigintT.js.map