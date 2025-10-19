import { entityKind } from "../entity.cjs";
import type { AnyMySqlColumn, MySqlColumn } from "./columns/index.cjs";
import { MySqlTable } from "./table.cjs";
export declare function primaryKey<TTableName extends string, TColumn extends AnyMySqlColumn<{
    tableName: TTableName;
}>, TColumns extends AnyMySqlColumn<{
    tableName: TTableName;
}>[]>(config: {
    name?: string;
    columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
export declare function primaryKey<TTableName extends string, TColumns extends AnyMySqlColumn<{
    tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
export declare class PrimaryKeyBuilder {
    static readonly [entityKind]: string;
    constructor(columns: MySqlColumn[], name?: string);
}
export declare class PrimaryKey {
    readonly table: MySqlTable;
    static readonly [entityKind]: string;
    readonly columns: MySqlColumn[];
    readonly name?: string;
    constructor(table: MySqlTable, columns: MySqlColumn[], name?: string);
    getName(): string;
}
