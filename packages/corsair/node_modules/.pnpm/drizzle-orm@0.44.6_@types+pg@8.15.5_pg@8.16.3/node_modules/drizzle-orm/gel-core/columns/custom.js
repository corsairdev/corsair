import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
class GelCustomColumnBuilder extends GelColumnBuilder {
  static [entityKind] = "GelCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "GelCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table) {
    return new GelCustomColumn(
      table,
      this.config
    );
  }
}
class GelCustomColumn extends GelColumn {
  static [entityKind] = "GelCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(table, config) {
    super(table, config);
    this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
    this.mapTo = config.customTypeParams.toDriver;
    this.mapFrom = config.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(value) {
    return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
  }
  mapToDriverValue(value) {
    return typeof this.mapTo === "function" ? this.mapTo(value) : value;
  }
}
function customType(customTypeParams) {
  return (a, b) => {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new GelCustomColumnBuilder(name, config, customTypeParams);
  };
}
export {
  GelCustomColumn,
  GelCustomColumnBuilder,
  customType
};
//# sourceMappingURL=custom.js.map