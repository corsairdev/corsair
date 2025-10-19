import { entityKind } from "../entity.cjs";
import type { SQL } from "../sql/index.cjs";
import type { GelTable } from "./table.cjs";
export declare class CheckBuilder {
    name: string;
    value: SQL;
    static readonly [entityKind]: string;
    protected brand: 'GelConstraintBuilder';
    constructor(name: string, value: SQL);
}
export declare class Check {
    table: GelTable;
    static readonly [entityKind]: string;
    readonly name: string;
    readonly value: SQL;
    constructor(table: GelTable, builder: CheckBuilder);
}
export declare function check(name: string, value: SQL): CheckBuilder;
