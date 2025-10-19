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
var query_builder_exports = {};
__export(query_builder_exports, {
  QueryBuilder: () => QueryBuilder
});
module.exports = __toCommonJS(query_builder_exports);
var import_entity = require("../../entity.cjs");
var import_dialect = require("../dialect.cjs");
var import_selection_proxy = require("../../selection-proxy.cjs");
var import_subquery = require("../../subquery.cjs");
var import_select = require("./select.cjs");
class QueryBuilder {
  static [import_entity.entityKind] = "MySqlQueryBuilder";
  dialect;
  dialectConfig;
  constructor(dialect) {
    this.dialect = (0, import_entity.is)(dialect, import_dialect.MySqlDialect) ? dialect : void 0;
    this.dialectConfig = (0, import_entity.is)(dialect, import_dialect.MySqlDialect) ? void 0 : dialect;
  }
  $with = (alias, selection) => {
    const queryBuilder = this;
    const as = (qb) => {
      if (typeof qb === "function") {
        qb = qb(queryBuilder);
      }
      return new Proxy(
        new import_subquery.WithSubquery(
          qb.getSQL(),
          selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
          alias,
          true
        ),
        new import_selection_proxy.SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      );
    };
    return { as };
  };
  with(...queries) {
    const self = this;
    function select(fields) {
      return new import_select.MySqlSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new import_select.MySqlSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries,
        distinct: true
      });
    }
    return { select, selectDistinct };
  }
  select(fields) {
    return new import_select.MySqlSelectBuilder({ fields: fields ?? void 0, session: void 0, dialect: this.getDialect() });
  }
  selectDistinct(fields) {
    return new import_select.MySqlSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    if (!this.dialect) {
      this.dialect = new import_dialect.MySqlDialect(this.dialectConfig);
    }
    return this.dialect;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QueryBuilder
});
//# sourceMappingURL=query-builder.cjs.map