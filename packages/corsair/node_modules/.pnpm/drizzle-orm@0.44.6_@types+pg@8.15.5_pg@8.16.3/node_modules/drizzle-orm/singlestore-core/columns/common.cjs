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
var common_exports = {};
__export(common_exports, {
  SingleStoreColumn: () => SingleStoreColumn,
  SingleStoreColumnBuilder: () => SingleStoreColumnBuilder,
  SingleStoreColumnBuilderWithAutoIncrement: () => SingleStoreColumnBuilderWithAutoIncrement,
  SingleStoreColumnWithAutoIncrement: () => SingleStoreColumnWithAutoIncrement
});
module.exports = __toCommonJS(common_exports);
var import_column_builder = require("../../column-builder.cjs");
var import_column = require("../../column.cjs");
var import_entity = require("../../entity.cjs");
var import_unique_constraint = require("../unique-constraint.cjs");
class SingleStoreColumnBuilder extends import_column_builder.ColumnBuilder {
  static [import_entity.entityKind] = "SingleStoreColumnBuilder";
  unique(name) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    return this;
  }
  // TODO: Implement generated columns for SingleStore (https://docs.singlestore.com/cloud/create-a-database/using-persistent-computed-columns/)
  /** @internal */
  generatedAlwaysAs(as, config) {
    this.config.generated = {
      as,
      type: "always",
      mode: config?.mode ?? "virtual"
    };
    return this;
  }
}
class SingleStoreColumn extends import_column.Column {
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = (0, import_unique_constraint.uniqueKeyName)(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
  static [import_entity.entityKind] = "SingleStoreColumn";
}
class SingleStoreColumnBuilderWithAutoIncrement extends SingleStoreColumnBuilder {
  static [import_entity.entityKind] = "SingleStoreColumnBuilderWithAutoIncrement";
  constructor(name, dataType, columnType) {
    super(name, dataType, columnType);
    this.config.autoIncrement = false;
  }
  autoincrement() {
    this.config.autoIncrement = true;
    this.config.hasDefault = true;
    return this;
  }
}
class SingleStoreColumnWithAutoIncrement extends SingleStoreColumn {
  static [import_entity.entityKind] = "SingleStoreColumnWithAutoIncrement";
  autoIncrement = this.config.autoIncrement;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SingleStoreColumn,
  SingleStoreColumnBuilder,
  SingleStoreColumnBuilderWithAutoIncrement,
  SingleStoreColumnWithAutoIncrement
});
//# sourceMappingURL=common.cjs.map