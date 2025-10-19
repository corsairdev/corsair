import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreVarCharBuilder extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreVarCharBuilder";
  /** @internal */
  constructor(name, config) {
    super(name, "string", "SingleStoreVarChar");
    this.config.length = config.length;
    this.config.enum = config.enum;
  }
  /** @internal */
  build(table) {
    return new SingleStoreVarChar(
      table,
      this.config
    );
  }
}
class SingleStoreVarChar extends SingleStoreColumn {
  static [entityKind] = "SingleStoreVarChar";
  length = this.config.length;
  enumValues = this.config.enum;
  getSQLType() {
    return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
  }
}
function varchar(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new SingleStoreVarCharBuilder(name, config);
}
export {
  SingleStoreVarChar,
  SingleStoreVarCharBuilder,
  varchar
};
//# sourceMappingURL=varchar.js.map