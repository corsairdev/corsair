import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
class GelJsonBuilder extends GelColumnBuilder {
  static [entityKind] = "GelJsonBuilder";
  constructor(name) {
    super(name, "json", "GelJson");
  }
  /** @internal */
  build(table) {
    return new GelJson(table, this.config);
  }
}
class GelJson extends GelColumn {
  static [entityKind] = "GelJson";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "json";
  }
}
function json(name) {
  return new GelJsonBuilder(name ?? "");
}
export {
  GelJson,
  GelJsonBuilder,
  json
};
//# sourceMappingURL=json.js.map