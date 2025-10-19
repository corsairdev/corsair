import { entityKind } from "../entity.js";
import type { AnySQLiteColumn, SQLiteColumn } from "./columns/index.js";
import { SQLiteTable } from "./table.js";
export declare function primaryKey<TTableName extends string, TColumn extends AnySQLiteColumn<{
    tableName: TTableName;
}>, TColumns extends AnySQLiteColumn<{
    tableName: TTableName;
}>[]>(config: {
    name?: string;
    columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
export declare function primaryKey<TTableName extends string, TColumns extends AnySQLiteColumn<{
    tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
export declare class PrimaryKeyBuilder {
    static readonly [entityKind]: string;
    _: {
        brand: 'SQLitePrimaryKeyBuilder';
    };
    constructor(columns: SQLiteColumn[], name?: string);
}
export declare class PrimaryKey {
    readonly table: SQLiteTable;
    static readonly [entityKind]: string;
    readonly columns: SQLiteColumn[];
    readonly name?: string;
    constructor(table: SQLiteTable, columns: SQLiteColumn[], name?: string);
    getName(): string;
}
