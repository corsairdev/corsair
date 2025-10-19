import { entityKind } from "../../entity.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreYearBuilder extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreYearBuilder";
  constructor(name) {
    super(name, "number", "SingleStoreYear");
  }
  /** @internal */
  build(table) {
    return new SingleStoreYear(
      table,
      this.config
    );
  }
}
class SingleStoreYear extends SingleStoreColumn {
  static [entityKind] = "SingleStoreYear";
  getSQLType() {
    return `year`;
  }
}
function year(name) {
  return new SingleStoreYearBuilder(name ?? "");
}
export {
  SingleStoreYear,
  SingleStoreYearBuilder,
  year
};
//# sourceMappingURL=year.js.map