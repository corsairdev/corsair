import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
class MySqlDateBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateBuilder";
  constructor(name) {
    super(name, "date", "MySqlDate");
  }
  /** @internal */
  build(table) {
    return new MySqlDate(table, this.config);
  }
}
class MySqlDate extends MySqlColumn {
  static [entityKind] = "MySqlDate";
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
class MySqlDateStringBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateStringBuilder";
  constructor(name) {
    super(name, "string", "MySqlDateString");
  }
  /** @internal */
  build(table) {
    return new MySqlDateString(
      table,
      this.config
    );
  }
}
class MySqlDateString extends MySqlColumn {
  static [entityKind] = "MySqlDateString";
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
    return new MySqlDateStringBuilder(name);
  }
  return new MySqlDateBuilder(name);
}
export {
  MySqlDate,
  MySqlDateBuilder,
  MySqlDateString,
  MySqlDateStringBuilder,
  date
};
//# sourceMappingURL=date.js.map