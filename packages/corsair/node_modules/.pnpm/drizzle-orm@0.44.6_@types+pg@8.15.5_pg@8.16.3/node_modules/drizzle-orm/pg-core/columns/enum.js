import { entityKind } from "../../entity.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
class PgEnumObjectColumnBuilder extends PgColumnBuilder {
  static [entityKind] = "PgEnumObjectColumnBuilder";
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumObjectColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table) {
    return new PgEnumObjectColumn(
      table,
      this.config
    );
  }
}
class PgEnumObjectColumn extends PgColumn {
  static [entityKind] = "PgEnumObjectColumn";
  enum;
  enumValues = this.config.enum.enumValues;
  constructor(table, config) {
    super(table, config);
    this.enum = config.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
}
const isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
class PgEnumColumnBuilder extends PgColumnBuilder {
  static [entityKind] = "PgEnumColumnBuilder";
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table) {
    return new PgEnumColumn(
      table,
      this.config
    );
  }
}
class PgEnumColumn extends PgColumn {
  static [entityKind] = "PgEnumColumn";
  enum = this.config.enum;
  enumValues = this.config.enum.enumValues;
  constructor(table, config) {
    super(table, config);
    this.enum = config.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
}
function pgEnum(enumName, input) {
  return Array.isArray(input) ? pgEnumWithSchema(enumName, [...input], void 0) : pgEnumObjectWithSchema(enumName, input, void 0);
}
function pgEnumWithSchema(enumName, values, schema) {
  const enumInstance = Object.assign(
    (name) => new PgEnumColumnBuilder(name ?? "", enumInstance),
    {
      enumName,
      enumValues: values,
      schema,
      [isPgEnumSym]: true
    }
  );
  return enumInstance;
}
function pgEnumObjectWithSchema(enumName, values, schema) {
  const enumInstance = Object.assign(
    (name) => new PgEnumObjectColumnBuilder(name ?? "", enumInstance),
    {
      enumName,
      enumValues: Object.values(values),
      schema,
      [isPgEnumSym]: true
    }
  );
  return enumInstance;
}
export {
  PgEnumColumn,
  PgEnumColumnBuilder,
  PgEnumObjectColumn,
  PgEnumObjectColumnBuilder,
  isPgEnum,
  pgEnum,
  pgEnumObjectWithSchema,
  pgEnumWithSchema
};
//# sourceMappingURL=enum.js.map