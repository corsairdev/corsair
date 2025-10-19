import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreCharBuilder extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreCharBuilder";
  constructor(name, config) {
    super(name, "string", "SingleStoreChar");
    this.config.length = config.length;
    this.config.enum = config.enum;
  }
  /** @internal */
  build(table) {
    return new SingleStoreChar(
      table,
      this.config
    );
  }
}
class SingleStoreChar extends SingleStoreColumn {
  static [entityKind] = "SingleStoreChar";
  length = this.config.length;
  enumValues = this.config.enum;
  getSQLType() {
    return this.length === void 0 ? `char` : `char(${this.length})`;
  }
}
function char(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new SingleStoreCharBuilder(name, config);
}
export {
  SingleStoreChar,
  SingleStoreCharBuilder,
  char
};
//# sourceMappingURL=char.js.map