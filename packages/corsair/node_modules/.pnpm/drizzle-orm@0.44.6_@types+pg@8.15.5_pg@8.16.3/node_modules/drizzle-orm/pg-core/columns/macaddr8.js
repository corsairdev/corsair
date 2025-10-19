import { entityKind } from "../../entity.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
class PgMacaddr8Builder extends PgColumnBuilder {
  static [entityKind] = "PgMacaddr8Builder";
  constructor(name) {
    super(name, "string", "PgMacaddr8");
  }
  /** @internal */
  build(table) {
    return new PgMacaddr8(table, this.config);
  }
}
class PgMacaddr8 extends PgColumn {
  static [entityKind] = "PgMacaddr8";
  getSQLType() {
    return "macaddr8";
  }
}
function macaddr8(name) {
  return new PgMacaddr8Builder(name ?? "");
}
export {
  PgMacaddr8,
  PgMacaddr8Builder,
  macaddr8
};
//# sourceMappingURL=macaddr8.js.map