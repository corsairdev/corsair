"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var enum_exports = {};
__export(enum_exports, {
  PgEnumColumn: () => PgEnumColumn,
  PgEnumColumnBuilder: () => PgEnumColumnBuilder,
  PgEnumObjectColumn: () => PgEnumObjectColumn,
  PgEnumObjectColumnBuilder: () => PgEnumObjectColumnBuilder,
  isPgEnum: () => isPgEnum,
  pgEnum: () => pgEnum,
  pgEnumObjectWithSchema: () => pgEnumObjectWithSchema,
  pgEnumWithSchema: () => pgEnumWithSchema
});
module.exports = __toCommonJS(enum_exports);
var import_entity = require("../../entity.cjs");
var import_common = require("./common.cjs");
class PgEnumObjectColumnBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgEnumObjectColumnBuilder";
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
class PgEnumObjectColumn extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgEnumObjectColumn";
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
class PgEnumColumnBuilder extends import_common.PgColumnBuilder {
  static [import_entity.entityKind] = "PgEnumColumnBuilder";
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
class PgEnumColumn extends import_common.PgColumn {
  static [import_entity.entityKind] = "PgEnumColumn";
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PgEnumColumn,
  PgEnumColumnBuilder,
  PgEnumObjectColumn,
  PgEnumObjectColumnBuilder,
  isPgEnum,
  pgEnum,
  pgEnumObjectWithSchema,
  pgEnumWithSchema
});
//# sourceMappingURL=enum.cjs.map