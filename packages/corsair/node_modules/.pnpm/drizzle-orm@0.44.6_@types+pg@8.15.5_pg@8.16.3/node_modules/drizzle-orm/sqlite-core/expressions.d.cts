import type { SQL, SQLWrapper } from "../sql/sql.cjs";
import type { SQLiteColumn } from "./columns/index.cjs";
export * from "../sql/expressions/index.cjs";
export declare function concat(column: SQLiteColumn | SQL.Aliased, value: string | SQLWrapper): SQL;
export declare function substring(column: SQLiteColumn | SQL.Aliased, { from, for: _for }: {
    from?: number | SQLWrapper;
    for?: number | SQLWrapper;
}): SQL;
export declare function rowId(): SQL<number>;
