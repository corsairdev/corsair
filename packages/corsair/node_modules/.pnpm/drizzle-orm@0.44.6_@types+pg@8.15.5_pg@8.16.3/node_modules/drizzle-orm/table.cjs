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
var table_exports = {};
__export(table_exports, {
  BaseName: () => BaseName,
  Columns: () => Columns,
  ExtraConfigBuilder: () => ExtraConfigBuilder,
  ExtraConfigColumns: () => ExtraConfigColumns,
  IsAlias: () => IsAlias,
  OriginalName: () => OriginalName,
  Schema: () => Schema,
  Table: () => Table,
  getTableName: () => getTableName,
  getTableUniqueName: () => getTableUniqueName,
  isTable: () => isTable
});
module.exports = __toCommonJS(table_exports);
var import_entity = require("./entity.cjs");
var import_table_utils = require("./table.utils.cjs");
const Schema = Symbol.for("drizzle:Schema");
const Columns = Symbol.for("drizzle:Columns");
const ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
const OriginalName = Symbol.for("drizzle:OriginalName");
const BaseName = Symbol.for("drizzle:BaseName");
const IsAlias = Symbol.for("drizzle:IsAlias");
const ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
const IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
class Table {
  static [import_entity.entityKind] = "Table";
  /** @internal */
  static Symbol = {
    Name: import_table_utils.TableName,
    Schema,
    OriginalName,
    Columns,
    ExtraConfigColumns,
    BaseName,
    IsAlias,
    ExtraConfigBuilder
  };
  /**
   * @internal
   * Can be changed if the table is aliased.
   */
  [import_table_utils.TableName];
  /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */
  [OriginalName];
  /** @internal */
  [Schema];
  /** @internal */
  [Columns];
  /** @internal */
  [ExtraConfigColumns];
  /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */
  [BaseName];
  /** @internal */
  [IsAlias] = false;
  /** @internal */
  [IsDrizzleTable] = true;
  /** @internal */
  [ExtraConfigBuilder] = void 0;
  constructor(name, schema, baseName) {
    this[import_table_utils.TableName] = this[OriginalName] = name;
    this[Schema] = schema;
    this[BaseName] = baseName;
  }
}
function isTable(table) {
  return typeof table === "object" && table !== null && IsDrizzleTable in table;
}
function getTableName(table) {
  return table[import_table_utils.TableName];
}
function getTableUniqueName(table) {
  return `${table[Schema] ?? "public"}.${table[import_table_utils.TableName]}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseName,
  Columns,
  ExtraConfigBuilder,
  ExtraConfigColumns,
  IsAlias,
  OriginalName,
  Schema,
  Table,
  getTableName,
  getTableUniqueName,
  isTable
});
//# sourceMappingURL=table.cjs.map