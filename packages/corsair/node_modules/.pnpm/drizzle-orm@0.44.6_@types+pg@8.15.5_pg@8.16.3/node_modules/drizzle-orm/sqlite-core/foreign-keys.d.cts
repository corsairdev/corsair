import { entityKind } from "../entity.cjs";
import type { AnySQLiteColumn, SQLiteColumn } from "./columns/index.cjs";
import type { SQLiteTable } from "./table.cjs";
export type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export type Reference = () => {
    readonly name?: string;
    readonly columns: SQLiteColumn[];
    readonly foreignTable: SQLiteTable;
    readonly foreignColumns: SQLiteColumn[];
};
export declare class ForeignKeyBuilder {
    static readonly [entityKind]: string;
    _: {
        brand: 'SQLiteForeignKeyBuilder';
        foreignTableName: 'TForeignTableName';
    };
    constructor(config: () => {
        name?: string;
        columns: SQLiteColumn[];
        foreignColumns: SQLiteColumn[];
    }, actions?: {
        onUpdate?: UpdateDeleteAction;
        onDelete?: UpdateDeleteAction;
    } | undefined);
    onUpdate(action: UpdateDeleteAction): this;
    onDelete(action: UpdateDeleteAction): this;
}
export declare class ForeignKey {
    readonly table: SQLiteTable;
    static readonly [entityKind]: string;
    readonly reference: Reference;
    readonly onUpdate: UpdateDeleteAction | undefined;
    readonly onDelete: UpdateDeleteAction | undefined;
    constructor(table: SQLiteTable, builder: ForeignKeyBuilder);
    getName(): string;
}
type ColumnsWithTable<TTableName extends string, TColumns extends SQLiteColumn[]> = {
    [Key in keyof TColumns]: AnySQLiteColumn<{
        tableName: TTableName;
    }>;
};
/**
 * @deprecated please use `foreignKey({ columns: [], foreignColumns: [] })` syntax without callback
 * @param config
 * @returns
 */
export declare function foreignKey<TTableName extends string, TForeignTableName extends string, TColumns extends [AnySQLiteColumn<{
    tableName: TTableName;
}>, ...AnySQLiteColumn<{
    tableName: TTableName;
}>[]]>(config: () => {
    name?: string;
    columns: TColumns;
    foreignColumns: ColumnsWithTable<TForeignTableName, TColumns>;
}): ForeignKeyBuilder;
export declare function foreignKey<TTableName extends string, TForeignTableName extends string, TColumns extends [AnySQLiteColumn<{
    tableName: TTableName;
}>, ...AnySQLiteColumn<{
    tableName: TTableName;
}>[]]>(config: {
    name?: string;
    columns: TColumns;
    foreignColumns: ColumnsWithTable<TForeignTableName, TColumns>;
}): ForeignKeyBuilder;
export {};
