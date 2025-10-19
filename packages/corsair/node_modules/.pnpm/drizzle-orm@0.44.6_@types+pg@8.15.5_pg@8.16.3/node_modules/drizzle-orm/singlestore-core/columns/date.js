import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreDateBuilder extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreDateBuilder";
  constructor(name) {
    super(name, "date", "SingleStoreDate");
  }
  /** @internal */
  build(table) {
    return new SingleStoreDate(
      table,
      this.config
    );
  }
}
class SingleStoreDate extends SingleStoreColumn {
  static [entityKind] = "SingleStoreDate";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `date`;
  }
  mapFromDriverValue(value) {
    return new Date(value);
  }
}
class SingleStoreDateStringBuilder extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreDateStringBuilder";
  constructor(name) {
    super(name, "string", "SingleStoreDateString");
  }
  /** @internal */
  build(table) {
    return new SingleStoreDateString(
      table,
      this.config
    );
  }
}
class SingleStoreDateString extends SingleStoreColumn {
  static [entityKind] = "SingleStoreDateString";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `date`;
  }
}
function date(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "string") {
    return new SingleStoreDateStringBuilder(name);
  }
  return new SingleStoreDateBuilder(name);
}
export {
  SingleStoreDate,
  SingleStoreDateBuilder,
  SingleStoreDateString,
  SingleStoreDateStringBuilder,
  date
};
//# sourceMappingURL=date.js.map