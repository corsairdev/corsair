import { entityKind } from "../../entity.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
class PgMacaddrBuilder extends PgColumnBuilder {
  static [entityKind] = "PgMacaddrBuilder";
  constructor(name) {
    super(name, "string", "PgMacaddr");
  }
  /** @internal */
  build(table) {
    return new PgMacaddr(table, this.config);
  }
}
class PgMacaddr extends PgColumn {
  static [entityKind] = "PgMacaddr";
  getSQLType() {
    return "macaddr";
  }
}
function macaddr(name) {
  return new PgMacaddrBuilder(name ?? "");
}
export {
  PgMacaddr,
  PgMacaddrBuilder,
  macaddr
};
//# sourceMappingURL=macaddr.js.map