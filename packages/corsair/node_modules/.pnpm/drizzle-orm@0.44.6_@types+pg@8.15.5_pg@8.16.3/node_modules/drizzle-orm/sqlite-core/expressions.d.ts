import type { SQL, SQLWrapper } from "../sql/sql.js";
import type { SQLiteColumn } from "./columns/index.js";
export * from "../sql/expressions/index.js";
export declare function concat(column: SQLiteColumn | SQL.Aliased, value: string | SQLWrapper): SQL;
export declare function substring(column: SQLiteColumn | SQL.Aliased, { from, for: _for }: {
    from?: number | SQLWrapper;
    for?: number | SQLWrapper;
}): SQL;
export declare function rowId(): SQL<number>;
