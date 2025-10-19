import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
class GelRelDurationBuilder extends GelColumnBuilder {
  static [entityKind] = "GelRelDurationBuilder";
  constructor(name) {
    super(name, "relDuration", "GelRelDuration");
  }
  /** @internal */
  build(table) {
    return new GelRelDuration(
      table,
      this.config
    );
  }
}
class GelRelDuration extends GelColumn {
  static [entityKind] = "GelRelDuration";
  getSQLType() {
    return `edgedbt.relative_duration_t`;
  }
}
function relDuration(name) {
  return new GelRelDurationBuilder(name ?? "");
}
export {
  GelRelDuration,
  GelRelDurationBuilder,
  relDuration
};
//# sourceMappingURL=relative-duration.js.map