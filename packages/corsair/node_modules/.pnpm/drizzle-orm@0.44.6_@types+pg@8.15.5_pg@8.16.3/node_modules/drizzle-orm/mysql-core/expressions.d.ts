import type { Placeholder, SQL, SQLWrapper } from "../sql/sql.js";
import type { MySqlColumn } from "./columns/index.js";
export * from "../sql/expressions/index.js";
export declare function concat(column: MySqlColumn | SQL.Aliased, value: string | Placeholder | SQLWrapper): SQL;
export declare function substring(column: MySqlColumn | SQL.Aliased, { from, for: _for }: {
    from?: number | Placeholder | SQLWrapper;
    for?: number | Placeholder | SQLWrapper;
}): SQL;
