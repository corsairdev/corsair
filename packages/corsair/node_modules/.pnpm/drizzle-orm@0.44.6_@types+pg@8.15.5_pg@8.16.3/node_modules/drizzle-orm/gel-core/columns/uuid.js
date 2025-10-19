import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
class GelUUIDBuilder extends GelColumnBuilder {
  static [entityKind] = "GelUUIDBuilder";
  constructor(name) {
    super(name, "string", "GelUUID");
  }
  /** @internal */
  build(table) {
    return new GelUUID(table, this.config);
  }
}
class GelUUID extends GelColumn {
  static [entityKind] = "GelUUID";
  getSQLType() {
    return "uuid";
  }
}
function uuid(name) {
  return new GelUUIDBuilder(name ?? "");
}
export {
  GelUUID,
  GelUUIDBuilder,
  uuid
};
//# sourceMappingURL=uuid.js.map