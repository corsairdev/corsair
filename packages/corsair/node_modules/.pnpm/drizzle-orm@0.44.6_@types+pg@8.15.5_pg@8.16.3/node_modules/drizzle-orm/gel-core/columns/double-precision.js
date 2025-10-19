import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
class GelDoublePrecisionBuilder extends GelColumnBuilder {
  static [entityKind] = "GelDoublePrecisionBuilder";
  constructor(name) {
    super(name, "number", "GelDoublePrecision");
  }
  /** @internal */
  build(table) {
    return new GelDoublePrecision(
      table,
      this.config
    );
  }
}
class GelDoublePrecision extends GelColumn {
  static [entityKind] = "GelDoublePrecision";
  getSQLType() {
    return "double precision";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number.parseFloat(value);
    }
    return value;
  }
}
function doublePrecision(name) {
  return new GelDoublePrecisionBuilder(name ?? "");
}
export {
  GelDoublePrecision,
  GelDoublePrecisionBuilder,
  doublePrecision
};
//# sourceMappingURL=double-precision.js.map