import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
class MySqlTimeBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlTimeBuilder";
  constructor(name, config) {
    super(name, "string", "MySqlTime");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlTime(table, this.config);
  }
}
class MySqlTime extends MySqlColumn {
  static [entityKind] = "MySqlTime";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `time${precision}`;
  }
}
function time(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlTimeBuilder(name, config);
}
export {
  MySqlTime,
  MySqlTimeBuilder,
  time
};
//# sourceMappingURL=time.js.map