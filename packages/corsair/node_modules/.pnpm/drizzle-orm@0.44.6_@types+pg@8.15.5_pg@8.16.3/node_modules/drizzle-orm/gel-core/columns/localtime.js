import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
class GelLocalTimeBuilder extends GelLocalDateColumnBaseBuilder {
  static [entityKind] = "GelLocalTimeBuilder";
  constructor(name) {
    super(name, "localTime", "GelLocalTime");
  }
  /** @internal */
  build(table) {
    return new GelLocalTime(
      table,
      this.config
    );
  }
}
class GelLocalTime extends GelColumn {
  static [entityKind] = "GelLocalTime";
  getSQLType() {
    return "cal::local_time";
  }
}
function localTime(name) {
  return new GelLocalTimeBuilder(name ?? "");
}
export {
  GelLocalTime,
  GelLocalTimeBuilder,
  localTime
};
//# sourceMappingURL=localtime.js.map