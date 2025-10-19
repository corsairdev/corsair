import type { GelColumn } from "./columns/index.js";
import type { Placeholder, SQL, SQLWrapper } from "../sql/sql.js";
export * from "../sql/expressions/index.js";
export declare function concat(column: GelColumn | SQL.Aliased, value: string | Placeholder | SQLWrapper): SQL;
export declare function substring(column: GelColumn | SQL.Aliased, { from, for: _for }: {
    from?: number | Placeholder | SQLWrapper;
    for?: number | Placeholder | SQLWrapper;
}): SQL;
