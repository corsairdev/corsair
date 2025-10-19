import { entityKind } from "../entity.js";
import { SelectionProxyHandler } from "../selection-proxy.js";
import { getTableColumns } from "../utils.js";
import { QueryBuilder } from "./query-builders/query-builder.js";
import { singlestoreTable } from "./table.js";
import { SingleStoreViewBase } from "./view-base.js";
import { SingleStoreViewConfig } from "./view-common.js";
class ViewBuilderCore {
  constructor(name, schema) {
    this.name = name;
    this.schema = schema;
  }
  static [entityKind] = "SingleStoreViewBuilder";
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
  static [entityKind] = "SingleStoreViewBuilder";
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
  static [entityKind] = "SingleStoreManualViewBuilder";
  columns;
  constructor(name, columns, schema) {
    super(name, schema);
    this.columns = getTableColumns(singlestoreTable(name, columns));
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
      new SingleStoreView({
        singlestoreConfig: this.config,
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
class SingleStoreView extends SingleStoreViewBase {
  static [entityKind] = "SingleStoreView";
  [SingleStoreViewConfig];
  constructor({ singlestoreConfig, config }) {
    super(config);
    this[SingleStoreViewConfig] = singlestoreConfig;
  }
}
export {
  ManualViewBuilder,
  SingleStoreView,
  ViewBuilder,
  ViewBuilderCore
};
//# sourceMappingURL=view.js.map