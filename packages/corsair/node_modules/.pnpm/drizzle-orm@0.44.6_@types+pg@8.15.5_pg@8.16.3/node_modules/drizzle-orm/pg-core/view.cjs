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
  ManualMaterializedViewBuilder: () => ManualMaterializedViewBuilder,
  ManualViewBuilder: () => ManualViewBuilder,
  MaterializedViewBuilder: () => MaterializedViewBuilder,
  MaterializedViewBuilderCore: () => MaterializedViewBuilderCore,
  PgMaterializedView: () => PgMaterializedView,
  PgMaterializedViewConfig: () => PgMaterializedViewConfig,
  PgView: () => PgView,
  ViewBuilder: () => ViewBuilder,
  isPgMaterializedView: () => isPgMaterializedView,
  isPgView: () => isPgView,
  pgMaterializedView: () => pgMaterializedView,
  pgMaterializedViewWithSchema: () => pgMaterializedViewWithSchema,
  pgView: () => pgView,
  pgViewWithSchema: () => pgViewWithSchema
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
  static [import_entity.entityKind] = "PgDefaultViewBuilderCore";
  config = {};
  with(config) {
    this.config.with = config;
    return this;
  }
}
class ViewBuilder extends DefaultViewBuilderCore {
  static [import_entity.entityKind] = "PgViewBuilder";
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
      new PgView({
        pgConfig: this.config,
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
  static [import_entity.entityKind] = "PgManualViewBuilder";
  columns;
  constructor(name, columns, schema) {
    super(name, schema);
    this.columns = (0, import_utils.getTableColumns)((0, import_table.pgTable)(name, columns));
  }
  existing() {
    return new Proxy(
      new PgView({
        pgConfig: void 0,
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
      new PgView({
        pgConfig: this.config,
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
  static [import_entity.entityKind] = "PgMaterializedViewBuilderCore";
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
  static [import_entity.entityKind] = "PgMaterializedViewBuilder";
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
      new PgMaterializedView({
        pgConfig: {
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
  static [import_entity.entityKind] = "PgManualMaterializedViewBuilder";
  columns;
  constructor(name, columns, schema) {
    super(name, schema);
    this.columns = (0, import_utils.getTableColumns)((0, import_table.pgTable)(name, columns));
  }
  existing() {
    return new Proxy(
      new PgMaterializedView({
        pgConfig: {
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
      new PgMaterializedView({
        pgConfig: {
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
class PgView extends import_view_base.PgViewBase {
  static [import_entity.entityKind] = "PgView";
  [import_view_common.PgViewConfig];
  constructor({ pgConfig, config }) {
    super(config);
    if (pgConfig) {
      this[import_view_common.PgViewConfig] = {
        with: pgConfig.with
      };
    }
  }
}
const PgMaterializedViewConfig = Symbol.for("drizzle:PgMaterializedViewConfig");
class PgMaterializedView extends import_view_base.PgViewBase {
  static [import_entity.entityKind] = "PgMaterializedView";
  [PgMaterializedViewConfig];
  constructor({ pgConfig, config }) {
    super(config);
    this[PgMaterializedViewConfig] = {
      with: pgConfig?.with,
      using: pgConfig?.using,
      tablespace: pgConfig?.tablespace,
      withNoData: pgConfig?.withNoData
    };
  }
}
function pgViewWithSchema(name, selection, schema) {
  if (selection) {
    return new ManualViewBuilder(name, selection, schema);
  }
  return new ViewBuilder(name, schema);
}
function pgMaterializedViewWithSchema(name, selection, schema) {
  if (selection) {
    return new ManualMaterializedViewBuilder(name, selection, schema);
  }
  return new MaterializedViewBuilder(name, schema);
}
function pgView(name, columns) {
  return pgViewWithSchema(name, columns, void 0);
}
function pgMaterializedView(name, columns) {
  return pgMaterializedViewWithSchema(name, columns, void 0);
}
function isPgView(obj) {
  return (0, import_entity.is)(obj, PgView);
}
function isPgMaterializedView(obj) {
  return (0, import_entity.is)(obj, PgMaterializedView);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DefaultViewBuilderCore,
  ManualMaterializedViewBuilder,
  ManualViewBuilder,
  MaterializedViewBuilder,
  MaterializedViewBuilderCore,
  PgMaterializedView,
  PgMaterializedViewConfig,
  PgView,
  ViewBuilder,
  isPgMaterializedView,
  isPgView,
  pgMaterializedView,
  pgMaterializedViewWithSchema,
  pgView,
  pgViewWithSchema
});
//# sourceMappingURL=view.cjs.map