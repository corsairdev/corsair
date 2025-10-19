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
var primary_keys_exports = {};
__export(primary_keys_exports, {
  PrimaryKey: () => PrimaryKey,
  PrimaryKeyBuilder: () => PrimaryKeyBuilder,
  primaryKey: () => primaryKey
});
module.exports = __toCommonJS(primary_keys_exports);
var import_entity = require("../entity.cjs");
var import_table = require("./table.cjs");
function primaryKey(...config) {
  if (config[0].columns) {
    return new PrimaryKeyBuilder(config[0].columns, config[0].name);
  }
  return new PrimaryKeyBuilder(config);
}
class PrimaryKeyBuilder {
  static [import_entity.entityKind] = "SingleStorePrimaryKeyBuilder";
  /** @internal */
  columns;
  /** @internal */
  name;
  constructor(columns, name) {
    this.columns = columns;
    this.name = name;
  }
  /** @internal */
  build(table) {
    return new PrimaryKey(table, this.columns, this.name);
  }
}
class PrimaryKey {
  constructor(table, columns, name) {
    this.table = table;
    this.columns = columns;
    this.name = name;
  }
  static [import_entity.entityKind] = "SingleStorePrimaryKey";
  columns;
  name;
  getName() {
    return this.name ?? `${this.table[import_table.SingleStoreTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrimaryKey,
  PrimaryKeyBuilder,
  primaryKey
});
//# sourceMappingURL=primary-keys.cjs.map