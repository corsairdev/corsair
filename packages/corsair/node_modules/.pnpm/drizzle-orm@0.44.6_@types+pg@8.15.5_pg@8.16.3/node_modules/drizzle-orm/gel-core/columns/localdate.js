import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
class GelLocalDateStringBuilder extends GelLocalDateColumnBaseBuilder {
  static [entityKind] = "GelLocalDateStringBuilder";
  constructor(name) {
    super(name, "localDate", "GelLocalDateString");
  }
  /** @internal */
  build(table) {
    return new GelLocalDateString(
      table,
      this.config
    );
  }
}
class GelLocalDateString extends GelColumn {
  static [entityKind] = "GelLocalDateString";
  getSQLType() {
    return "cal::local_date";
  }
}
function localDate(name) {
  return new GelLocalDateStringBuilder(name ?? "");
}
export {
  GelLocalDateString,
  GelLocalDateStringBuilder,
  localDate
};
//# sourceMappingURL=localdate.js.map