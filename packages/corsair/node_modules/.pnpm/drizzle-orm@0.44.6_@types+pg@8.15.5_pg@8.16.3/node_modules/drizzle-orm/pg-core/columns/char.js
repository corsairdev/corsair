import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
class PgCharBuilder extends PgColumnBuilder {
  static [entityKind] = "PgCharBuilder";
  constructor(name, config) {
    super(name, "string", "PgChar");
    this.config.length = config.length;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgChar(
      table,
      this.config
    );
  }
}
class PgChar extends PgColumn {
  static [entityKind] = "PgChar";
  length = this.config.length;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.length === void 0 ? `char` : `char(${this.length})`;
  }
}
function char(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new PgCharBuilder(name, config);
}
export {
  PgChar,
  PgCharBuilder,
  char
};
//# sourceMappingURL=char.js.map