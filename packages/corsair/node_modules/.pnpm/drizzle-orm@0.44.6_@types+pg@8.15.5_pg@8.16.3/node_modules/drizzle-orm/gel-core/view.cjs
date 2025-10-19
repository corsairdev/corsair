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
  DefaultViewBuilderCore: () => DefaultViewBuilderCore,
  GelMaterializedView: () => GelMaterializedView,
  GelMaterializedViewConfig: () => GelMaterializedViewConfig,
  GelView: () => GelView,
  ManualMaterializedViewBuilder: () => ManualMaterializedViewBuilder,
  ManualViewBuilder: () => ManualViewBuilder,
  MaterializedViewBuilder: () => MaterializedViewBuilder,
  MaterializedViewBuilderCore: () => MaterializedViewBuilderCore,
  ViewBuilder: () => ViewBuilder,
  gelMaterializedViewWithSchema: () => gelMaterializedViewWithSchema,
  gelViewWithSchema: () => gelViewWithSchema
});
module.exports = __toCommonJS(view_exports);
var import_entity = require("../entity.cjs");
var import_selection_proxy = require("../selection-proxy.cjs");
var import_utils = require("../utils.cjs");
var import_query_builder = require("./query-builders/query-builder.cjs");
var import_table = require("./table.cjs");
var import_view_base = require("./view-base.cjs");
var import_view_common = require("./view-common.cjs");
class DefaultViewBuilderCore {
  constructor(name, schema) {
    this.name = name;
    this.schema = schema;
  }
  static [import_entity.entityKind] = "GelDefaultViewBuilderCore";
  config = {};
  with(config) {
    this.config.with = config;
    return this;
  }
}
class ViewBuilder extends DefaultViewBuilderCore {
  static [import_entity.entityKind] = "GelViewBuilder";
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
      new GelView({
        GelConfig: this.config,
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
class ManualViewBuilder extends DefaultViewBuilderCore {
  static [import_entity.entityKind] = "GelManualViewBuilder";
  columns;
  constructor(name, columns, schema) {
    super(name, schema);
    this.columns = (0, import_utils.getTableColumns)((0, import_table.gelTable)(name, columns));
  }
  existing() {
    return new Proxy(
      new GelView({
        GelConfig: void 0,
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
      new GelView({
        GelConfig: this.config,
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
class MaterializedViewBuilderCore {
  constructor(name, schema) {
    this.name = name;
    this.schema = schema;
  }
  static [import_entity.entityKind] = "GelMaterializedViewBuilderCore";
  config = {};
  using(using) {
    this.config.using = using;
    return this;
  }
  with(config) {
    this.config.with = config;
    return this;
  }
  tablespace(tablespace) {
    this.config.tablespace = tablespace;
    return this;
  }
  withNoData() {
    this.config.withNoData = true;
    return this;
  }
}
class MaterializedViewBuilder extends MaterializedViewBuilderCore {
  static [import_entity.entityKind] = "GelMaterializedViewBuilder";
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
      new GelMaterializedView({
        GelConfig: {
          with: this.config.with,
          using: this.config.using,
          tablespace: this.config.tablespace,
          withNoData: this.config.withNoData
        },
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
class ManualMaterializedViewBuilder extends MaterializedViewBuilderCore {
  static [import_entity.entityKind] = "GelManualMaterializedViewBuilder";
  columns;
  constructor(name, columns, schema) {
    super(name, schema);
    this.columns = (0, import_utils.getTableColumns)((0, import_table.gelTable)(name, columns));
  }
  existing() {
    return new Proxy(
      new GelMaterializedView({
        GelConfig: {
          tablespace: this.config.tablespace,
          using: this.config.using,
          with: this.config.with,
          withNoData: this.config.withNoData
        },
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
      new GelMaterializedView({
        GelConfig: {
          tablespace: this.config.tablespace,
          using: this.config.using,
          with: this.config.with,
          withNoData: this.config.withNoData
        },
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
class GelView extends import_view_base.GelViewBase {
  static [import_entity.entityKind] = "GelView";
  [import_view_common.GelViewConfig];
  constructor({ GelConfig, config }) {
    super(config);
    if (GelConfig) {
      this[import_view_common.GelViewConfig] = {
        with: GelConfig.with
      };
    }
  }
}
const GelMaterializedViewConfig = Symbol.for("drizzle:GelMaterializedViewConfig");
class GelMaterializedView extends import_view_base.GelViewBase {
  static [import_entity.entityKind] = "GelMaterializedView";
  [GelMaterializedViewConfig];
  constructor({ GelConfig, config }) {
    super(config);
    this[GelMaterializedViewConfig] = {
      with: GelConfig?.with,
      using: GelConfig?.using,
      tablespace: GelConfig?.tablespace,
      withNoData: GelConfig?.withNoData
    };
  }
}
function gelViewWithSchema(name, selection, schema) {
  if (selection) {
    return new ManualViewBuilder(name, selection, schema);
  }
  return new ViewBuilder(name, schema);
}
function gelMaterializedViewWithSchema(name, selection, schema) {
  if (selection) {
    return new ManualMaterializedViewBuilder(name, selection, schema);
  }
  return new MaterializedViewBuilder(name, schema);
}
function gelView(name, columns) {
  return gelViewWithSchema(name, columns, void 0);
}
function gelMaterializedView(name, columns) {
  return gelMaterializedViewWithSchema(name, columns, void 0);
}
function isGelView(obj) {
  return (0, import_entity.is)(obj, GelView);
}
function isGelMaterializedView(obj) {
  return (0, import_entity.is)(obj, GelMaterializedView);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DefaultViewBuilderCore,
  GelMaterializedView,
  GelMaterializedViewConfig,
  GelView,
  ManualMaterializedViewBuilder,
  ManualViewBuilder,
  MaterializedViewBuilder,
  MaterializedViewBuilderCore,
  ViewBuilder,
  gelMaterializedViewWithSchema,
  gelViewWithSchema
});
//# sourceMappingURL=view.cjs.map