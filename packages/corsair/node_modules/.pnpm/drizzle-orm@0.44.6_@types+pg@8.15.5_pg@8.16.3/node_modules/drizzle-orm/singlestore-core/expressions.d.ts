import type { Placeholder, SQL, SQLWrapper } from "../sql/sql.js";
import type { SingleStoreColumn } from "./columns/index.js";
export * from "../sql/expressions/index.js";
export declare function concat(column: SingleStoreColumn | SQL.Aliased, value: string | Placeholder | SQLWrapper): SQL;
export declare function substring(column: SingleStoreColumn | SQL.Aliased, { from, for: _for }: {
    from?: number | Placeholder | SQLWrapper;
    for?: number | Placeholder | SQLWrapper;
}): SQL;
export declare function dotProduct(column: SingleStoreColumn | SQL.Aliased, value: Array<number>): SQL;
export declare function euclideanDistance(column: SingleStoreColumn | SQL.Aliased, value: Array<number>): SQL;
