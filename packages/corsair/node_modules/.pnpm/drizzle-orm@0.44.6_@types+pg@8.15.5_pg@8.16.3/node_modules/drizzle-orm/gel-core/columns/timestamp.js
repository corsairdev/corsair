import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
class GelTimestampBuilder extends GelLocalDateColumnBaseBuilder {
  static [entityKind] = "GelTimestampBuilder";
  constructor(name) {
    super(name, "localDateTime", "GelTimestamp");
  }
  /** @internal */
  build(table) {
    return new GelTimestamp(
      table,
      this.config
    );
  }
}
class GelTimestamp extends GelColumn {
  static [entityKind] = "GelTimestamp";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "cal::local_datetime";
  }
}
function timestamp(name) {
  return new GelTimestampBuilder(name ?? "");
}
export {
  GelTimestamp,
  GelTimestampBuilder,
  timestamp
};
//# sourceMappingURL=timestamp.js.map