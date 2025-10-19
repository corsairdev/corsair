import { entityKind } from "../entity.cjs";
import type { AnySingleStoreColumn, SingleStoreColumn } from "./columns/index.cjs";
import { SingleStoreTable } from "./table.cjs";
export declare function primaryKey<TTableName extends string, TColumn extends AnySingleStoreColumn<{
    tableName: TTableName;
}>, TColumns extends AnySingleStoreColumn<{
    tableName: TTableName;
}>[]>(config: {
    name?: string;
    columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
export declare function primaryKey<TTableName extends string, TColumns extends AnySingleStoreColumn<{
    tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
export declare class PrimaryKeyBuilder {
    static readonly [entityKind]: string;
    constructor(columns: SingleStoreColumn[], name?: string);
}
export declare class PrimaryKey {
    readonly table: SingleStoreTable;
    static readonly [entityKind]: string;
    readonly columns: SingleStoreColumn[];
    readonly name?: string;
    constructor(table: SingleStoreTable, columns: SingleStoreColumn[], name?: string);
    getName(): string;
}
