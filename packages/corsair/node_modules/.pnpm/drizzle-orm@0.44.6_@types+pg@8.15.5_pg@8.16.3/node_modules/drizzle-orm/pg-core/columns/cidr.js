import { entityKind } from "../../entity.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
class PgCidrBuilder extends PgColumnBuilder {
  static [entityKind] = "PgCidrBuilder";
  constructor(name) {
    super(name, "string", "PgCidr");
  }
  /** @internal */
  build(table) {
    return new PgCidr(table, this.config);
  }
}
class PgCidr extends PgColumn {
  static [entityKind] = "PgCidr";
  getSQLType() {
    return "cidr";
  }
}
function cidr(name) {
  return new PgCidrBuilder(name ?? "");
}
export {
  PgCidr,
  PgCidrBuilder,
  cidr
};
//# sourceMappingURL=cidr.js.map