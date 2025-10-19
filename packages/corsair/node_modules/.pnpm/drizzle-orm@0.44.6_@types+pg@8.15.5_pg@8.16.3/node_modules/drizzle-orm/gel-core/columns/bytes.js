import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
class GelBytesBuilder extends GelColumnBuilder {
  static [entityKind] = "GelBytesBuilder";
  constructor(name) {
    super(name, "buffer", "GelBytes");
  }
  /** @internal */
  build(table) {
    return new GelBytes(
      table,
      this.config
    );
  }
}
class GelBytes extends GelColumn {
  static [entityKind] = "GelBytes";
  getSQLType() {
    return "bytea";
  }
}
function bytes(name) {
  return new GelBytesBuilder(name ?? "");
}
export {
  GelBytes,
  GelBytesBuilder,
  bytes
};
//# sourceMappingURL=bytes.js.map