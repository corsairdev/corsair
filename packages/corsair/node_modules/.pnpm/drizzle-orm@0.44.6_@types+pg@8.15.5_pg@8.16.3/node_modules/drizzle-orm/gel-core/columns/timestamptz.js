import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
class GelTimestampTzBuilder extends GelLocalDateColumnBaseBuilder {
  static [entityKind] = "GelTimestampTzBuilder";
  constructor(name) {
    super(name, "date", "GelTimestampTz");
  }
  /** @internal */
  build(table) {
    return new GelTimestampTz(
      table,
      this.config
    );
  }
}
class GelTimestampTz extends GelColumn {
  static [entityKind] = "GelTimestampTz";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "datetime";
  }
}
function timestamptz(name) {
  return new GelTimestampTzBuilder(name ?? "");
}
export {
  GelTimestampTz,
  GelTimestampTzBuilder,
  timestamptz
};
//# sourceMappingURL=timestamptz.js.map