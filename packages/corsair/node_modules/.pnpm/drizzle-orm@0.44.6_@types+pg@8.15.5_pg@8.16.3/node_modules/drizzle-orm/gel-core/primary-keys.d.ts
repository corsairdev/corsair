import { entityKind } from "../entity.js";
import type { AnyGelColumn, GelColumn } from "./columns/index.js";
import { GelTable } from "./table.js";
export declare function primaryKey<TTableName extends string, TColumn extends AnyGelColumn<{
    tableName: TTableName;
}>, TColumns extends AnyGelColumn<{
    tableName: TTableName;
}>[]>(config: {
    name?: string;
    columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
export declare function primaryKey<TTableName extends string, TColumns extends AnyGelColumn<{
    tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
export declare class PrimaryKeyBuilder {
    static readonly [entityKind]: string;
    constructor(columns: GelColumn[], name?: string);
}
export declare class PrimaryKey {
    readonly table: GelTable;
    static readonly [entityKind]: string;
    readonly columns: AnyGelColumn<{}>[];
    readonly name?: string;
    constructor(table: GelTable, columns: AnyGelColumn<{}>[], name?: string);
    getName(): string;
}
