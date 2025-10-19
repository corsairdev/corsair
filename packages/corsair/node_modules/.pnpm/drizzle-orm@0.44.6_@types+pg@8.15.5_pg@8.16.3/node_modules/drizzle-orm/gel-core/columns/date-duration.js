import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
class GelDateDurationBuilder extends GelColumnBuilder {
  static [entityKind] = "GelDateDurationBuilder";
  constructor(name) {
    super(name, "dateDuration", "GelDateDuration");
  }
  /** @internal */
  build(table) {
    return new GelDateDuration(
      table,
      this.config
    );
  }
}
class GelDateDuration extends GelColumn {
  static [entityKind] = "GelDateDuration";
  getSQLType() {
    return `dateDuration`;
  }
}
function dateDuration(name) {
  return new GelDateDurationBuilder(name ?? "");
}
export {
  GelDateDuration,
  GelDateDurationBuilder,
  dateDuration
};
//# sourceMappingURL=date-duration.js.map