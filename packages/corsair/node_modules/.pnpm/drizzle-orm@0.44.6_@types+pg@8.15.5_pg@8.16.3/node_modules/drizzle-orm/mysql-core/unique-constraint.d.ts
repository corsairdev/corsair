import { entityKind } from "../entity.js";
import type { MySqlColumn } from "./columns/index.js";
import type { MySqlTable } from "./table.js";
export declare function unique(name?: string): UniqueOnConstraintBuilder;
export declare function uniqueKeyName(table: MySqlTable, columns: string[]): string;
export declare class UniqueConstraintBuilder {
    private name?;
    static readonly [entityKind]: string;
    constructor(columns: MySqlColumn[], name?: string | undefined);
}
export declare class UniqueOnConstraintBuilder {
    static readonly [entityKind]: string;
    constructor(name?: string);
    on(...columns: [MySqlColumn, ...MySqlColumn[]]): UniqueConstraintBuilder;
}
export declare class UniqueConstraint {
    readonly table: MySqlTable;
    static readonly [entityKind]: string;
    readonly columns: MySqlColumn[];
    readonly name?: string;
    readonly nullsNotDistinct: boolean;
    constructor(table: MySqlTable, columns: MySqlColumn[], name?: string);
    getName(): string | undefined;
}
