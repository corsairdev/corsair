import type { Placeholder, SQL, SQLWrapper } from "../sql/sql.cjs";
import type { MySqlColumn } from "./columns/index.cjs";
export * from "../sql/expressions/index.cjs";
export declare function concat(column: MySqlColumn | SQL.Aliased, value: string | Placeholder | SQLWrapper): SQL;
export declare function substring(column: MySqlColumn | SQL.Aliased, { from, for: _for }: {
    from?: number | Placeholder | SQLWrapper;
    for?: number | Placeholder | SQLWrapper;
}): SQL;
