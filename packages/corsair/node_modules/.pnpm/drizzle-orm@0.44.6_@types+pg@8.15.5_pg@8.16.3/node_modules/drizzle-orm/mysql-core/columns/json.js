import { entityKind } from "../../entity.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
class MySqlJsonBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlJsonBuilder";
  constructor(name) {
    super(name, "json", "MySqlJson");
  }
  /** @internal */
  build(table) {
    return new MySqlJson(table, this.config);
  }
}
class MySqlJson extends MySqlColumn {
  static [entityKind] = "MySqlJson";
  getSQLType() {
    return "json";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
}
function json(name) {
  return new MySqlJsonBuilder(name ?? "");
}
export {
  MySqlJson,
  MySqlJsonBuilder,
  json
};
//# sourceMappingURL=json.js.map