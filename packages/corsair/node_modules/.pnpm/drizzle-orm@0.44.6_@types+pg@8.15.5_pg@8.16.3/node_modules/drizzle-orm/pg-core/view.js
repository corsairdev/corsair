import { entityKind, is } from "../entity.js";
import { SelectionProxyHandler } from "../selection-proxy.js";
import { getTableColumns } from "../utils.js";
import { QueryBuilder } from "./query-builders/query-builder.js";
import { pgTable } from "./table.js";
import { PgViewBase } from "./view-base.js";
import { PgViewConfig } from "./view-common.js";
class DefaultViewBuilderCore {
  constructor(name, schema) {
    this.name = name;
    this.schema = schema;
  }
  static [entityKind] = "PgDefaultViewBuilderCore";
  config = {};
  with(config) {
    this.config.with = config;
    return this;
  }
}
class ViewBuilder extends DefaultViewBuilderCore {
  static [entityKind] = "PgViewBuilder";
  as(qb) {
    if (typeof qb === "function") {
      qb = qb(new QueryBuilder());
    }
    const selectionProxy = new SelectionProxyHandler({
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
  static [entityKind] = "PgManualViewBuilder";
  columns;
  constructor(name, columns, schema) {
    super(name, schema);
    this.columns = getTableColumns(pgTable(name, columns));
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
      new SelectionProxyHandler({
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
      new SelectionProxyHandler({
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
  static [entityKind] = "PgMaterializedViewBuilderCore";
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
  static [entityKind] = "PgMaterializedViewBuilder";
  as(qb) {
    if (typeof qb === "function") {
      qb = qb(new QueryBuilder());
    }
    const selectionProxy = new SelectionProxyHandler({
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
  static [entityKind] = "PgManualMaterializedViewBuilder";
  columns;
  constructor(name, columns, schema) {
    super(name, schema);
    this.columns = getTableColumns(pgTable(name, columns));
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
      new SelectionProxyHandler({
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
      new SelectionProxyHandler({
        alias: this.name,
        sqlBehavior: "error",
        sqlAliasedBehavior: "alias",
        replaceOriginalName: true
      })
    );
  }
}
class PgView extends PgViewBase {
  static [entityKind] = "PgView";
  [PgViewConfig];
  constructor({ pgConfig, config }) {
    super(config);
    if (pgConfig) {
      this[PgViewConfig] = {
        with: pgConfig.with
      };
    }
  }
}
const PgMaterializedViewConfig = Symbol.for("drizzle:PgMaterializedViewConfig");
class PgMaterializedView extends PgViewBase {
  static [entityKind] = "PgMaterializedView";
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
  return is(obj, PgView);
}
function isPgMaterializedView(obj) {
  return is(obj, PgMaterializedView);
}
export {
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
};
//# sourceMappingURL=view.js.map