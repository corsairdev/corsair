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
  SQLiteView: () => SQLiteView,
  ViewBuilder: () => ViewBuilder,
  ViewBuilderCore: () => ViewBuilderCore,
  sqliteView: () => sqliteView,
  view: () => view
});
module.exports = __toCommonJS(view_exports);
var import_entity = require("../entity.cjs");
var import_selection_proxy = require("../selection-proxy.cjs");
var import_utils = require("../utils.cjs");
var import_query_builder = require("./query-builders/query-builder.cjs");
var import_table = require("./table.cjs");
var import_view_base = require("./view-base.cjs");
class ViewBuilderCore {
  constructor(name) {
    this.name = name;
  }
  static [import_entity.entityKind] = "SQLiteViewBuilderCore";
  config = {};
}
class ViewBuilder extends ViewBuilderCore {
  static [import_entity.entityKind] = "SQLiteViewBuilder";
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
    const aliasedSelectedFields = qb.getSelectedFields();
    return new Proxy(
      new SQLiteView({
        // sqliteConfig: this.config,
        config: {
          name: this.name,
          schema: void 0,
          selectedFields: aliasedSelectedFields,
          query: qb.getSQL().inlineParams()
        }
      }),
      selectionProxy
    );
  }
}
class ManualViewBuilder extends ViewBuilderCore {
  static [import_entity.entityKind] = "SQLiteManualViewBuilder";
  columns;
  constructor(name, columns) {
    super(name);
    this.columns = (0, import_utils.getTableColumns)((0, import_table.sqliteTable)(name, columns));
  }
  existing() {
    return new Proxy(
      new SQLiteView({
        config: {
          name: this.name,
          schema: void 0,
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
      new SQLiteView({
        config: {
          name: this.name,
          schema: void 0,
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
class SQLiteView extends import_view_base.SQLiteViewBase {
  static [import_entity.entityKind] = "SQLiteView";
  constructor({ config }) {
    super(config);
  }
}
function sqliteView(name, selection) {
  if (selection) {
    return new ManualViewBuilder(name, selection);
  }
  return new ViewBuilder(name);
}
const view = sqliteView;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ManualViewBuilder,
  SQLiteView,
  ViewBuilder,
  ViewBuilderCore,
  sqliteView,
  view
});
//# sourceMappingURL=view.cjs.map