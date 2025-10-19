import { entityKind } from "../entity.cjs";
import type { SQL } from "../sql/index.cjs";
import type { PgTable } from "./table.cjs";
export declare class CheckBuilder {
    name: string;
    value: SQL;
    static readonly [entityKind]: string;
    protected brand: 'PgConstraintBuilder';
    constructor(name: string, value: SQL);
}
export declare class Check {
    table: PgTable;
    static readonly [entityKind]: string;
    readonly name: string;
    readonly value: SQL;
    constructor(table: PgTable, builder: CheckBuilder);
}
export declare function check(name: string, value: SQL): CheckBuilder;
