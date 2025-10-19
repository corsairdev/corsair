import { entityKind } from "../../entity.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreJsonBuilder extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreJsonBuilder";
  constructor(name) {
    super(name, "json", "SingleStoreJson");
  }
  /** @internal */
  build(table) {
    return new SingleStoreJson(
      table,
      this.config
    );
  }
}
class SingleStoreJson extends SingleStoreColumn {
  static [entityKind] = "SingleStoreJson";
  getSQLType() {
    return "json";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
}
function json(name) {
  return new SingleStoreJsonBuilder(name ?? "");
}
export {
  SingleStoreJson,
  SingleStoreJsonBuilder,
  json
};
//# sourceMappingURL=json.js.map