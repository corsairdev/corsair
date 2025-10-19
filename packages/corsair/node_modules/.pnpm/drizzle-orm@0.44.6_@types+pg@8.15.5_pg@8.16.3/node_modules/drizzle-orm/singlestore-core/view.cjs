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
  SingleStoreView: () => SingleStoreView,
  ViewBuilder: () => ViewBuilder,
  ViewBuilderCore: () => ViewBuilderCore
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
  static [import_entity.entityKind] = "SingleStoreViewBuilder";
  config = {};
  algorithm(algorithm) {
    this.config.algorithm = algorithm;
    return this;
  }
  definer(definer) {
    this.config.definer = definer;
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
  static [import_entity.entityKind] = "SingleStoreViewBuilder";
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
      new SingleStoreView({
        singlestoreConfig: this.config,
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
  static [import_entity.entityKind] = "SingleStoreManualViewBuilder";
  columns;
  constructor(name, columns, schema) {
    super(name, schema);
    this.columns = (0, import_utils.getTableColumns)((0, import_table.singlestoreTable)(name, columns));
  }
  existing() {
    return new Proxy(
      new SingleStoreView({
        singlestoreConfig: void 0,
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
      new SingleStoreView({
        singlestoreConfig: this.config,
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
class SingleStoreView extends import_view_base.SingleStoreViewBase {
  static [import_entity.entityKind] = "SingleStoreView";
  [import_view_common.SingleStoreViewConfig];
  constructor({ singlestoreConfig, config }) {
    super(config);
    this[import_view_common.SingleStoreViewConfig] = singlestoreConfig;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ManualViewBuilder,
  SingleStoreView,
  ViewBuilder,
  ViewBuilderCore
});
//# sourceMappingURL=view.cjs.map