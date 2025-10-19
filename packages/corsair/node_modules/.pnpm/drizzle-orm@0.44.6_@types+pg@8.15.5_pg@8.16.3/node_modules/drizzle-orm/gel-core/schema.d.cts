import { entityKind } from "../entity.cjs";
import { SQL, type SQLWrapper } from "../sql/sql.cjs";
import type { gelSequence } from "./sequence.cjs";
import { type GelTableFn } from "./table.cjs";
export declare class GelSchema<TName extends string = string> implements SQLWrapper {
    readonly schemaName: TName;
    static readonly [entityKind]: string;
    constructor(schemaName: TName);
    table: GelTableFn<TName>;
    sequence: typeof gelSequence;
    getSQL(): SQL;
    shouldOmitSQLParens(): boolean;
}
export declare function isGelSchema(obj: unknown): obj is GelSchema;
export declare function gelSchema<T extends string>(name: T): GelSchema<T>;
