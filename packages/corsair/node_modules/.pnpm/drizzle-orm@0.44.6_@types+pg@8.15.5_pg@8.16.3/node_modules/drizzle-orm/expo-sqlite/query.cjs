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
var query_exports = {};
__export(query_exports, {
  useLiveQuery: () => useLiveQuery
});
module.exports = __toCommonJS(query_exports);
var import_expo_sqlite = require("expo-sqlite");
var import_react = require("react");
var import_entity = require("../entity.cjs");
var import_sql = require("../sql/sql.cjs");
var import_sqlite_core = require("../sqlite-core/index.cjs");
var import_query = require("../sqlite-core/query-builders/query.cjs");
var import_subquery = require("../subquery.cjs");
const useLiveQuery = (query, deps = []) => {
  const [data, setData] = (0, import_react.useState)(
    (0, import_entity.is)(query, import_query.SQLiteRelationalQuery) && query.mode === "first" ? void 0 : []
  );
  const [error, setError] = (0, import_react.useState)();
  const [updatedAt, setUpdatedAt] = (0, import_react.useState)();
  (0, import_react.useEffect)(() => {
    const entity = (0, import_entity.is)(query, import_query.SQLiteRelationalQuery) ? query.table : query.config.table;
    if ((0, import_entity.is)(entity, import_subquery.Subquery) || (0, import_entity.is)(entity, import_sql.SQL)) {
      setError(new Error("Selecting from subqueries and SQL are not supported in useLiveQuery"));
      return;
    }
    let listener;
    const handleData = (data2) => {
      setData(data2);
      setUpdatedAt(/* @__PURE__ */ new Date());
    };
    query.then(handleData).catch(setError);
    if ((0, import_entity.is)(entity, import_sqlite_core.SQLiteTable) || (0, import_entity.is)(entity, import_sqlite_core.SQLiteView)) {
      const config = (0, import_entity.is)(entity, import_sqlite_core.SQLiteTable) ? (0, import_sqlite_core.getTableConfig)(entity) : (0, import_sqlite_core.getViewConfig)(entity);
      listener = (0, import_expo_sqlite.addDatabaseChangeListener)(({ tableName }) => {
        if (config.name === tableName) {
          query.then(handleData).catch(setError);
        }
      });
    }
    return () => {
      listener?.remove();
    };
  }, deps);
  return {
    data,
    error,
    updatedAt
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useLiveQuery
});
//# sourceMappingURL=query.cjs.map