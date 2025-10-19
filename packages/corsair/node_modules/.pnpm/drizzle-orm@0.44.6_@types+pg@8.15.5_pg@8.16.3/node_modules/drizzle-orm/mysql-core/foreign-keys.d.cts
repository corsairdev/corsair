import { entityKind } from "../entity.cjs";
import type { AnyMySqlColumn, MySqlColumn } from "./columns/index.cjs";
import type { MySqlTable } from "./table.cjs";
export type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export type Reference = () => {
    readonly name?: string;
    readonly columns: MySqlColumn[];
    readonly foreignTable: MySqlTable;
    readonly foreignColumns: MySqlColumn[];
};
export declare class ForeignKeyBuilder {
    static readonly [entityKind]: string;
    constructor(config: () => {
        name?: string;
        columns: MySqlColumn[];
        foreignColumns: MySqlColumn[];
    }, actions?: {
        onUpdate?: UpdateDeleteAction;
        onDelete?: UpdateDeleteAction;
    } | undefined);
    onUpdate(action: UpdateDeleteAction): this;
    onDelete(action: UpdateDeleteAction): this;
}
export type AnyForeignKeyBuilder = ForeignKeyBuilder;
export declare class ForeignKey {
    readonly table: MySqlTable;
    static readonly [entityKind]: string;
    readonly reference: Reference;
    readonly onUpdate: UpdateDeleteAction | undefined;
    readonly onDelete: UpdateDeleteAction | undefined;
    constructor(table: MySqlTable, builder: ForeignKeyBuilder);
    getName(): string;
}
type ColumnsWithTable<TTableName extends string, TColumns extends MySqlColumn[]> = {
    [Key in keyof TColumns]: AnyMySqlColumn<{
        tableName: TTableName;
    }>;
};
export type GetColumnsTable<TColumns extends MySqlColumn | MySqlColumn[]> = (TColumns extends MySqlColumn ? TColumns : TColumns extends MySqlColumn[] ? TColumns[number] : never) extends AnyMySqlColumn<{
    tableName: infer TTableName extends string;
}> ? TTableName : never;
export declare function foreignKey<TTableName extends string, TForeignTableName extends string, TColumns extends [AnyMySqlColumn<{
    tableName: TTableName;
}>, ...AnyMySqlColumn<{
    tableName: TTableName;
}>[]]>(config: {
    name?: string;
    columns: TColumns;
    foreignColumns: ColumnsWithTable<TForeignTableName, TColumns>;
}): ForeignKeyBuilder;
export {};
