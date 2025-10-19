import { entityKind } from "../entity.js";
import { SelectionProxyHandler } from "../selection-proxy.js";
import { getTableColumns } from "../utils.js";
import { QueryBuilder } from "./query-builders/query-builder.js";
import { sqliteTable } from "./table.js";
import { SQLiteViewBase } from "./view-base.js";
class ViewBuilderCore {
  constructor(name) {
    this.name = name;
  }
  static [entityKind] = "SQLiteViewBuilderCore";
  config = {};
}
class ViewBuilder extends ViewBuilderCore {
  static [entityKind] = "SQLiteViewBuilder";
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
  static [entityKind] = "SQLiteManualViewBuilder";
  columns;
  constructor(name, columns) {
    super(name);
    this.columns = getTableColumns(sqliteTable(name, columns));
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
      new SQLiteView({
        config: {
          name: this.name,
          schema: void 0,
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
class SQLiteView extends SQLiteViewBase {
  static [entityKind] = "SQLiteView";
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
export {
  ManualViewBuilder,
  SQLiteView,
  ViewBuilder,
  ViewBuilderCore,
  sqliteView,
  view
};
//# sourceMappingURL=view.js.map