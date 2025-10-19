import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
class GelDurationBuilder extends GelColumnBuilder {
  static [entityKind] = "GelDurationBuilder";
  constructor(name) {
    super(name, "duration", "GelDuration");
  }
  /** @internal */
  build(table) {
    return new GelDuration(table, this.config);
  }
}
class GelDuration extends GelColumn {
  static [entityKind] = "GelDuration";
  getSQLType() {
    return `duration`;
  }
}
function duration(name) {
  return new GelDurationBuilder(name ?? "");
}
export {
  GelDuration,
  GelDurationBuilder,
  duration
};
//# sourceMappingURL=duration.js.map