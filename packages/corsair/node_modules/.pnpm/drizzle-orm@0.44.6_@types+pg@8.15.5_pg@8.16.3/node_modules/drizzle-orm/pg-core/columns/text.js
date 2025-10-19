import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
class PgTextBuilder extends PgColumnBuilder {
  static [entityKind] = "PgTextBuilder";
  constructor(name, config) {
    super(name, "string", "PgText");
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgText(table, this.config);
  }
}
class PgText extends PgColumn {
  static [entityKind] = "PgText";
  enumValues = this.config.enumValues;
  getSQLType() {
    return "text";
  }
}
function text(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgTextBuilder(name, config);
}
export {
  PgText,
  PgTextBuilder,
  text
};
//# sourceMappingURL=text.js.map