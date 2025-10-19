import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreEnumColumnBuilder extends SingleStoreColumnBuilder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generatedAlwaysAs(as, config) {
    throw new Error("Method not implemented.");
  }
  static [entityKind] = "SingleStoreEnumColumnBuilder";
  constructor(name, values) {
    super(name, "string", "SingleStoreEnumColumn");
    this.config.enumValues = values;
  }
  /** @internal */
  build(table) {
    return new SingleStoreEnumColumn(
      table,
      this.config
    );
  }
}
class SingleStoreEnumColumn extends SingleStoreColumn {
  static [entityKind] = "SingleStoreEnumColumn";
  enumValues = this.config.enumValues;
  getSQLType() {
    return `enum(${this.enumValues.map((value) => `'${value}'`).join(",")})`;
  }
}
function singlestoreEnum(a, b) {
  const { name, config: values } = getColumnNameAndConfig(a, b);
  if (values.length === 0) {
    throw new Error(`You have an empty array for "${name}" enum values`);
  }
  return new SingleStoreEnumColumnBuilder(name, values);
}
export {
  SingleStoreEnumColumn,
  SingleStoreEnumColumnBuilder,
  singlestoreEnum
};
//# sourceMappingURL=enum.js.map