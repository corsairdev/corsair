import { entityKind } from "../entity.cjs";
import { SQL, type SQLWrapper } from "../sql/sql.cjs";
import type { NonArray, Writable } from "../utils.cjs";
import { type PgEnum, type PgEnumObject } from "./columns/enum.cjs";
import { type pgSequence } from "./sequence.cjs";
import { type PgTableFn } from "./table.cjs";
import { type pgMaterializedView, type pgView } from "./view.cjs";
export declare class PgSchema<TName extends string = string> implements SQLWrapper {
    readonly schemaName: TName;
    static readonly [entityKind]: string;
    constructor(schemaName: TName);
    table: PgTableFn<TName>;
    view: typeof pgView;
    materializedView: typeof pgMaterializedView;
    enum<U extends string, T extends Readonly<[U, ...U[]]>>(enumName: string, values: T | Writable<T>): PgEnum<Writable<T>>;
    enum<E extends Record<string, string>>(enumName: string, enumObj: NonArray<E>): PgEnumObject<E>;
    sequence: typeof pgSequence;
    getSQL(): SQL;
    shouldOmitSQLParens(): boolean;
}
export declare function isPgSchema(obj: unknown): obj is PgSchema;
export declare function pgSchema<T extends string>(name: T): PgSchema<T>;
