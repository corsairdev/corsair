import { addDatabaseChangeListener } from "expo-sqlite";
import { useEffect, useState } from "react";
import { is } from "../entity.js";
import { SQL } from "../sql/sql.js";
import { getTableConfig, getViewConfig, SQLiteTable, SQLiteView } from "../sqlite-core/index.js";
import { SQLiteRelationalQuery } from "../sqlite-core/query-builders/query.js";
import { Subquery } from "../subquery.js";
const useLiveQuery = (query, deps = []) => {
  const [data, setData] = useState(
    is(query, SQLiteRelationalQuery) && query.mode === "first" ? void 0 : []
  );
  const [error, setError] = useState();
  const [updatedAt, setUpdatedAt] = useState();
  useEffect(() => {
    const entity = is(query, SQLiteRelationalQuery) ? query.table : query.config.table;
    if (is(entity, Subquery) || is(entity, SQL)) {
      setError(new Error("Selecting from subqueries and SQL are not supported in useLiveQuery"));
      return;
    }
    let listener;
    const handleData = (data2) => {
      setData(data2);
      setUpdatedAt(/* @__PURE__ */ new Date());
    };
    query.then(handleData).catch(setError);
    if (is(entity, SQLiteTable) || is(entity, SQLiteView)) {
      const config = is(entity, SQLiteTable) ? getTableConfig(entity) : getViewConfig(entity);
      listener = addDatabaseChangeListener(({ tableName }) => {
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
export {
  useLiveQuery
};
//# sourceMappingURL=query.js.map