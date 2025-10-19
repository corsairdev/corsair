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
var view_exports = {};
__export(view_exports, {
  ManualViewBuilder: () => ManualViewBuilder,
  MySqlView: () => MySqlView,
  ViewBuilder: () => ViewBuilder,
  ViewBuilderCore: () => ViewBuilderCore,
  mysqlView: () => mysqlView,
  mysqlViewWithSchema: () => mysqlViewWithSchema
});
module.exports = __toCommonJS(view_exports);
var import_entity = require("../entity.cjs");
var import_selection_proxy = require("../selection-proxy.cjs");
var import_utils = require("../utils.cjs");
var import_query_builder = require("./query-builders/query-builder.cjs");
var import_table = require("./table.cjs");
var import_view_base = require("./view-base.cjs");
var import_view_common = require("./view-common.cjs");
class ViewBuilderCore {
  constructor(name, schema) {
    this.name = name;
    this.schema = schema;
  }
  static [import_entity.entityKind] = "MySqlViewBuilder";
  config = {};
  algorithm(algorithm) {
    this.config.algorithm = algorithm;
    return this;
  }
  sqlSecurity(sqlSecurity) {
    this.config.sqlSecurity = sqlSecurity;
    return this;
  }
  withCheckOption(withCheckOption) {
    this.config.withCheckOption = withCheckOption ?? "cascaded";
    return this;
  }
}
class ViewBuilder extends ViewBuilderCore {
  static [import_entity.entityKind] = "MySqlViewBuilder";
  as(qb) {
    if (typeof qb === "function") {
      qb = qb(new import_query_builder.QueryBuilder());
    }
    const selectionProxy = new import_selection_proxy.SelectionProxyHandler({
      alias: this.name,
      sqlBehavior: "error",
      sqlAliasedBehavior: "alias",
      replaceOriginalName: true
    });
    const aliasedSelection = new Proxy(qb.getSelectedFields(), selectionProxy);
    return new Proxy(
      new MySqlView({
        mysqlConfig: this.config,
        config: {
          name: this.name,
          schema: this.schema,
          selectedFields: aliasedSelection,
          query: qb.getSQL().inlineParams()
        }
      }),
      selectionProxy
    );
  }
}
class ManualViewBuilder extends ViewBuilderCore {
  static [import_entity.entityKind] = "MySqlManualViewBuilder";
  columns;
  constructor(name, columns, schema) {
    super(name, schema);
    this.columns = (0, import_utils.getTableColumns)((0, import_table.mysqlTable)(name, columns));
  }
  existing() {
    return new Proxy(
      new MySqlView({
        mysqlConfig: void 0,
        config: {
          name: this.name,
          schema: this.schema,
          selectedFields: this.columns,
          query: void 0
        }
      }),
      new import_selection_proxy.SelectionProxyHandler({
        alias: this.name,
        sqlBehavior: "error",
        sqlAliasedBehavior: "alias",
        replaceOriginalName: true
      })
    );
  }
  as(query) {
    return new Proxy(
      new MySqlView({
        mysqlConfig: this.config,
        config: {
          name: this.name,
          schema: this.schema,
          selectedFields: this.columns,
          query: query.inlineParams()
        }
      }),
      new import_selection_proxy.SelectionProxyHandler({
        alias: this.name,
        sqlBehavior: "error",
        sqlAliasedBehavior: "alias",
        replaceOriginalName: true
      })
    );
  }
}
class MySqlView extends import_view_base.MySqlViewBase {
  static [import_entity.entityKind] = "MySqlView";
  [import_view_common.MySqlViewConfig];
  constructor({ mysqlConfig, config }) {
    super(config);
    this[import_view_common.MySqlViewConfig] = mysqlConfig;
  }
}
function mysqlViewWithSchema(name, selection, schema) {
  if (selection) {
    return new ManualViewBuilder(name, selection, schema);
  }
  return new ViewBuilder(name, schema);
}
function mysqlView(name, selection) {
  return mysqlViewWithSchema(name, selection, void 0);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ManualViewBuilder,
  MySqlView,
  ViewBuilder,
  ViewBuilderCore,
  mysqlView,
  mysqlViewWithSchema
});
//# sourceMappingURL=view.cjs.map