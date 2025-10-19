import { entityKind } from "../entity.cjs";
import type { AnyPgColumn, PgColumn } from "./columns/index.cjs";
import { PgTable } from "./table.cjs";
export declare function primaryKey<TTableName extends string, TColumn extends AnyPgColumn<{
    tableName: TTableName;
}>, TColumns extends AnyPgColumn<{
    tableName: TTableName;
}>[]>(config: {
    name?: string;
    columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
export declare function primaryKey<TTableName extends string, TColumns extends AnyPgColumn<{
    tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
export declare class PrimaryKeyBuilder {
    static readonly [entityKind]: string;
    constructor(columns: PgColumn[], name?: string);
}
export declare class PrimaryKey {
    readonly table: PgTable;
    static readonly [entityKind]: string;
    readonly columns: AnyPgColumn<{}>[];
    readonly name?: string;
    constructor(table: PgTable, columns: AnyPgColumn<{}>[], name?: string);
    getName(): string;
}
