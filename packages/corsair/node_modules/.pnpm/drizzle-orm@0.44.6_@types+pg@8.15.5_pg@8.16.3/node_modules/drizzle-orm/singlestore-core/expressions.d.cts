import type { Placeholder, SQL, SQLWrapper } from "../sql/sql.cjs";
import type { SingleStoreColumn } from "./columns/index.cjs";
export * from "../sql/expressions/index.cjs";
export declare function concat(column: SingleStoreColumn | SQL.Aliased, value: string | Placeholder | SQLWrapper): SQL;
export declare function substring(column: SingleStoreColumn | SQL.Aliased, { from, for: _for }: {
    from?: number | Placeholder | SQLWrapper;
    for?: number | Placeholder | SQLWrapper;
}): SQL;
export declare function dotProduct(column: SingleStoreColumn | SQL.Aliased, value: Array<number>): SQL;
export declare function euclideanDistance(column: SingleStoreColumn | SQL.Aliased, value: Array<number>): SQL;
