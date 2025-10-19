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
  SQLiteColumn: () => SQLiteColumn,
  SQLiteColumnBuilder: () => SQLiteColumnBuilder
});
module.exports = __toCommonJS(common_exports);
var import_column_builder = require("../../column-builder.cjs");
var import_column = require("../../column.cjs");
var import_entity = require("../../entity.cjs");
var import_foreign_keys = require("../foreign-keys.cjs");
var import_unique_constraint = require("../unique-constraint.cjs");
class SQLiteColumnBuilder extends import_column_builder.ColumnBuilder {
  static [import_entity.entityKind] = "SQLiteColumnBuilder";
  foreignKeyConfigs = [];
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    return this;
  }
  generatedAlwaysAs(as, config) {
    this.config.generated = {
      as,
      type: "always",
      mode: config?.mode ?? "virtual"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return ((ref2, actions2) => {
        const builder = new import_foreign_keys.ForeignKeyBuilder(() => {
          const foreignColumn = ref2();
          return { columns: [column], foreignColumns: [foreignColumn] };
        });
        if (actions2.onUpdate) {
          builder.onUpdate(actions2.onUpdate);
        }
        if (actions2.onDelete) {
          builder.onDelete(actions2.onDelete);
        }
        return builder.build(table);
      })(ref, actions);
    });
  }
}
class SQLiteColumn extends import_column.Column {
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = (0, import_unique_constraint.uniqueKeyName)(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
  static [import_entity.entityKind] = "SQLiteColumn";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SQLiteColumn,
  SQLiteColumnBuilder
});
//# sourceMappingURL=common.cjs.map