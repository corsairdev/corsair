import { entityKind } from "../entity.cjs";
import type { PgColumn } from "./columns/index.cjs";
import type { PgTable } from "./table.cjs";
export declare function unique(name?: string): UniqueOnConstraintBuilder;
export declare function uniqueKeyName(table: PgTable, columns: string[]): string;
export declare class UniqueConstraintBuilder {
    private name?;
    static readonly [entityKind]: string;
    constructor(columns: PgColumn[], name?: string | undefined);
    nullsNotDistinct(): this;
}
export declare class UniqueOnConstraintBuilder {
    static readonly [entityKind]: string;
    constructor(name?: string);
    on(...columns: [PgColumn, ...PgColumn[]]): UniqueConstraintBuilder;
}
export declare class UniqueConstraint {
    readonly table: PgTable;
    static readonly [entityKind]: string;
    readonly columns: PgColumn[];
    readonly name?: string;
    readonly nullsNotDistinct: boolean;
    constructor(table: PgTable, columns: PgColumn[], nullsNotDistinct: boolean, name?: string);
    getName(): string | undefined;
}
