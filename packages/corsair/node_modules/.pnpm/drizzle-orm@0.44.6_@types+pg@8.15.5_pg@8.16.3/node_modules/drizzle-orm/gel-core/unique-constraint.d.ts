import { entityKind } from "../entity.js";
import type { GelColumn } from "./columns/index.js";
import type { GelTable } from "./table.js";
export declare function unique(name?: string): UniqueOnConstraintBuilder;
export declare function uniqueKeyName(table: GelTable, columns: string[]): string;
export declare class UniqueConstraintBuilder {
    private name?;
    static readonly [entityKind]: string;
    constructor(columns: GelColumn[], name?: string | undefined);
    nullsNotDistinct(): this;
}
export declare class UniqueOnConstraintBuilder {
    static readonly [entityKind]: string;
    constructor(name?: string);
    on(...columns: [GelColumn, ...GelColumn[]]): UniqueConstraintBuilder;
}
export declare class UniqueConstraint {
    readonly table: GelTable;
    static readonly [entityKind]: string;
    readonly columns: GelColumn[];
    readonly name?: string;
    readonly nullsNotDistinct: boolean;
    constructor(table: GelTable, columns: GelColumn[], nullsNotDistinct: boolean, name?: string);
    getName(): string | undefined;
}
