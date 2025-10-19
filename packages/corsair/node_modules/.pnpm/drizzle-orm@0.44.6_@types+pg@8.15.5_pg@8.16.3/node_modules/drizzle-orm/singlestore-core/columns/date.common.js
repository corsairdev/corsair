import { entityKind } from "../../entity.js";
import { sql } from "../../sql/sql.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreDateColumnBaseBuilder extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreDateColumnBuilder";
  defaultNow() {
    return this.default(sql`now()`);
  }
  onUpdateNow() {
    this.config.hasOnUpdateNow = true;
    this.config.hasDefault = true;
    return this;
  }
}
class SingleStoreDateBaseColumn extends SingleStoreColumn {
  static [entityKind] = "SingleStoreDateColumn";
  hasOnUpdateNow = this.config.hasOnUpdateNow;
}
export {
  SingleStoreDateBaseColumn,
  SingleStoreDateColumnBaseBuilder
};
//# sourceMappingURL=date.common.js.map