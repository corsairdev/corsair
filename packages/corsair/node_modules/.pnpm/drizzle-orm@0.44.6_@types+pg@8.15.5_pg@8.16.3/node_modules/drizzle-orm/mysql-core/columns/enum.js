import { entityKind } from "../../entity.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
class MySqlEnumColumnBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlEnumColumnBuilder";
  constructor(name, values) {
    super(name, "string", "MySqlEnumColumn");
    this.config.enumValues = values;
  }
  /** @internal */
  build(table) {
    return new MySqlEnumColumn(
      table,
      this.config
    );
  }
}
class MySqlEnumColumn extends MySqlColumn {
  static [entityKind] = "MySqlEnumColumn";
  enumValues = this.config.enumValues;
  getSQLType() {
    return `enum(${this.enumValues.map((value) => `'${value}'`).join(",")})`;
  }
}
class MySqlEnumObjectColumnBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlEnumObjectColumnBuilder";
  constructor(name, values) {
    super(name, "string", "MySqlEnumObjectColumn");
    this.config.enumValues = values;
  }
  /** @internal */
  build(table) {
    return new MySqlEnumObjectColumn(
      table,
      this.config
    );
  }
}
class MySqlEnumObjectColumn extends MySqlColumn {
  static [entityKind] = "MySqlEnumObjectColumn";
  enumValues = this.config.enumValues;
  getSQLType() {
    return `enum(${this.enumValues.map((value) => `'${value}'`).join(",")})`;
  }
}
function mysqlEnum(a, b) {
  if (typeof a === "string" && Array.isArray(b) || Array.isArray(a)) {
    const name = typeof a === "string" && a.length > 0 ? a : "";
    const values = (typeof a === "string" ? b : a) ?? [];
    if (values.length === 0) {
      throw new Error(`You have an empty array for "${name}" enum values`);
    }
    return new MySqlEnumColumnBuilder(name, values);
  }
  if (typeof a === "string" && typeof b === "object" || typeof a === "object") {
    const name = typeof a === "object" ? "" : a;
    const values = typeof a === "object" ? Object.values(a) : typeof b === "object" ? Object.values(b) : [];
    if (values.length === 0) {
      throw new Error(`You have an empty array for "${name}" enum values`);
    }
    return new MySqlEnumObjectColumnBuilder(name, values);
  }
}
export {
  MySqlEnumColumn,
  MySqlEnumColumnBuilder,
  MySqlEnumObjectColumn,
  MySqlEnumObjectColumnBuilder,
  mysqlEnum
};
//# sourceMappingURL=enum.js.map