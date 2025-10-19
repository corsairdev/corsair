import { entityKind } from "../../entity.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreTimeBuilder extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreTimeBuilder";
  constructor(name) {
    super(name, "string", "SingleStoreTime");
  }
  /** @internal */
  build(table) {
    return new SingleStoreTime(
      table,
      this.config
    );
  }
}
class SingleStoreTime extends SingleStoreColumn {
  static [entityKind] = "SingleStoreTime";
  getSQLType() {
    return `time`;
  }
}
function time(name) {
  return new SingleStoreTimeBuilder(name ?? "");
}
export {
  SingleStoreTime,
  SingleStoreTimeBuilder,
  time
};
//# sourceMappingURL=time.js.map