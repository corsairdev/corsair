import { entityKind } from "../../entity.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
class PgSerialBuilder extends PgColumnBuilder {
  static [entityKind] = "PgSerialBuilder";
  constructor(name) {
    super(name, "number", "PgSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgSerial(table, this.config);
  }
}
class PgSerial extends PgColumn {
  static [entityKind] = "PgSerial";
  getSQLType() {
    return "serial";
  }
}
function serial(name) {
  return new PgSerialBuilder(name ?? "");
}
export {
  PgSerial,
  PgSerialBuilder,
  serial
};
//# sourceMappingURL=serial.js.map