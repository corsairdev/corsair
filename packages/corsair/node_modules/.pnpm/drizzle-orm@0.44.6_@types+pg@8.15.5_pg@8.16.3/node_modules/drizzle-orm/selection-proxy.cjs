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
var selection_proxy_exports = {};
__export(selection_proxy_exports, {
  SelectionProxyHandler: () => SelectionProxyHandler
});
module.exports = __toCommonJS(selection_proxy_exports);
var import_alias = require("./alias.cjs");
var import_column = require("./column.cjs");
var import_entity = require("./entity.cjs");
var import_sql = require("./sql/sql.cjs");
var import_subquery = require("./subquery.cjs");
var import_view_common = require("./view-common.cjs");
class SelectionProxyHandler {
  static [import_entity.entityKind] = "SelectionProxyHandler";
  config;
  constructor(config) {
    this.config = { ...config };
  }
  get(subquery, prop) {
    if (prop === "_") {
      return {
        ...subquery["_"],
        selectedFields: new Proxy(
          subquery._.selectedFields,
          this
        )
      };
    }
    if (prop === import_view_common.ViewBaseConfig) {
      return {
        ...subquery[import_view_common.ViewBaseConfig],
        selectedFields: new Proxy(
          subquery[import_view_common.ViewBaseConfig].selectedFields,
          this
        )
      };
    }
    if (typeof prop === "symbol") {
      return subquery[prop];
    }
    const columns = (0, import_entity.is)(subquery, import_subquery.Subquery) ? subquery._.selectedFields : (0, import_entity.is)(subquery, import_sql.View) ? subquery[import_view_common.ViewBaseConfig].selectedFields : subquery;
    const value = columns[prop];
    if ((0, import_entity.is)(value, import_sql.SQL.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
        return value.sql;
      }
      const newValue = value.clone();
      newValue.isSelectionField = true;
      return newValue;
    }
    if ((0, import_entity.is)(value, import_sql.SQL)) {
      if (this.config.sqlBehavior === "sql") {
        return value;
      }
      throw new Error(
        `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    if ((0, import_entity.is)(value, import_column.Column)) {
      if (this.config.alias) {
        return new Proxy(
          value,
          new import_alias.ColumnAliasProxyHandler(
            new Proxy(
              value.table,
              new import_alias.TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
            )
          )
        );
      }
      return value;
    }
    if (typeof value !== "object" || value === null) {
      return value;
    }
    return new Proxy(value, new SelectionProxyHandler(this.config));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SelectionProxyHandler
});
//# sourceMappingURL=selection-proxy.cjs.map