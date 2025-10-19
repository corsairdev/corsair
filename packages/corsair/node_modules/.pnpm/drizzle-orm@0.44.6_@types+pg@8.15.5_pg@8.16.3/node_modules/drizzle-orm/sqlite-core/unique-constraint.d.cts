import { entityKind } from "../entity.cjs";
import type { SQLiteColumn } from "./columns/common.cjs";
import type { SQLiteTable } from "./table.cjs";
export declare function uniqueKeyName(table: SQLiteTable, columns: string[]): string;
export declare function unique(name?: string): UniqueOnConstraintBuilder;
export declare class UniqueConstraintBuilder {
    private name?;
    static readonly [entityKind]: string;
    constructor(columns: SQLiteColumn[], name?: string | undefined);
}
export declare class UniqueOnConstraintBuilder {
    static readonly [entityKind]: string;
    constructor(name?: string);
    on(...columns: [SQLiteColumn, ...SQLiteColumn[]]): UniqueConstraintBuilder;
}
export declare class UniqueConstraint {
    readonly table: SQLiteTable;
    static readonly [entityKind]: string;
    readonly columns: SQLiteColumn[];
    readonly name?: string;
    constructor(table: SQLiteTable, columns: SQLiteColumn[], name?: string);
    getName(): string | undefined;
}
