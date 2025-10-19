import { entityKind } from "../entity.cjs";
import type { SQL } from "../sql/sql.cjs";
import type { MySqlTable } from "./table.cjs";
export declare class CheckBuilder {
    name: string;
    value: SQL;
    static readonly [entityKind]: string;
    protected brand: 'MySqlConstraintBuilder';
    constructor(name: string, value: SQL);
}
export declare class Check {
    table: MySqlTable;
    static readonly [entityKind]: string;
    readonly name: string;
    readonly value: SQL;
    constructor(table: MySqlTable, builder: CheckBuilder);
}
export declare function check(name: string, value: SQL): CheckBuilder;
