import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
class MySqlDateTimeBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateTimeBuilder";
  constructor(name, config) {
    super(name, "date", "MySqlDateTime");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlDateTime(
      table,
      this.config
    );
  }
}
class MySqlDateTime extends MySqlColumn {
  static [entityKind] = "MySqlDateTime";
  fsp;
  constructor(table, config) {
    super(table, config);
    this.fsp = config.fsp;
  }
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `datetime${precision}`;
  }
  mapToDriverValue(value) {
    return value.toISOString().replace("T", " ").replace("Z", "");
  }
  mapFromDriverValue(value) {
    return /* @__PURE__ */ new Date(value.replace(" ", "T") + "Z");
  }
}
class MySqlDateTimeStringBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateTimeStringBuilder";
  constructor(name, config) {
    super(name, "string", "MySqlDateTimeString");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlDateTimeString(
      table,
      this.config
    );
  }
}
class MySqlDateTimeString extends MySqlColumn {
  static [entityKind] = "MySqlDateTimeString";
  fsp;
  constructor(table, config) {
    super(table, config);
    this.fsp = config.fsp;
  }
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `datetime${precision}`;
  }
}
function datetime(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "string") {
    return new MySqlDateTimeStringBuilder(name, config);
  }
  return new MySqlDateTimeBuilder(name, config);
}
export {
  MySqlDateTime,
  MySqlDateTimeBuilder,
  MySqlDateTimeString,
  MySqlDateTimeStringBuilder,
  datetime
};
//# sourceMappingURL=datetime.js.map