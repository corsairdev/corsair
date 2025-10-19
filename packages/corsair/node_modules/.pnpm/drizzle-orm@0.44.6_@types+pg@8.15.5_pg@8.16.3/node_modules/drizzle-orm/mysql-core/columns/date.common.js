import { entityKind } from "../../entity.js";
import { sql } from "../../sql/sql.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
class MySqlDateColumnBaseBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateColumnBuilder";
  defaultNow() {
    return this.default(sql`(now())`);
  }
  // "on update now" also adds an implicit default value to the column - https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html
  onUpdateNow() {
    this.config.hasOnUpdateNow = true;
    this.config.hasDefault = true;
    return this;
  }
}
class MySqlDateBaseColumn extends MySqlColumn {
  static [entityKind] = "MySqlDateColumn";
  hasOnUpdateNow = this.config.hasOnUpdateNow;
}
export {
  MySqlDateBaseColumn,
  MySqlDateColumnBaseBuilder
};
//# sourceMappingURL=date.common.js.map