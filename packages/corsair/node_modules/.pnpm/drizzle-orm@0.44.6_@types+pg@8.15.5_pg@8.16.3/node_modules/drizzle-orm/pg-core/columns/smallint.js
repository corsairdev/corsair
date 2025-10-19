import { entityKind } from "../../entity.js";
import { PgColumn } from "./common.js";
import { PgIntColumnBaseBuilder } from "./int.common.js";
class PgSmallIntBuilder extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgSmallIntBuilder";
  constructor(name) {
    super(name, "number", "PgSmallInt");
  }
  /** @internal */
  build(table) {
    return new PgSmallInt(table, this.config);
  }
}
class PgSmallInt extends PgColumn {
  static [entityKind] = "PgSmallInt";
  getSQLType() {
    return "smallint";
  }
  mapFromDriverValue = (value) => {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  };
}
function smallint(name) {
  return new PgSmallIntBuilder(name ?? "");
}
export {
  PgSmallInt,
  PgSmallIntBuilder,
  smallint
};
//# sourceMappingURL=smallint.js.map