import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
class GelTextBuilder extends GelColumnBuilder {
  static [entityKind] = "GelTextBuilder";
  constructor(name) {
    super(name, "string", "GelText");
  }
  /** @internal */
  build(table) {
    return new GelText(table, this.config);
  }
}
class GelText extends GelColumn {
  static [entityKind] = "GelText";
  enumValues = this.config.enumValues;
  getSQLType() {
    return "text";
  }
}
function text(name) {
  return new GelTextBuilder(name ?? "");
}
export {
  GelText,
  GelTextBuilder,
  text
};
//# sourceMappingURL=text.js.map