import type { BuildColumns } from "../column-builder.js";
import { entityKind } from "../entity.js";
import { Table, type TableConfig as TableConfigBase, type UpdateTableConfig } from "../table.js";
import type { CheckBuilder } from "./checks.js";
import { type SQLiteColumnBuilders } from "./columns/all.js";
import type { SQLiteColumn, SQLiteColumnBuilderBase } from "./columns/common.js";
import type { ForeignKeyBuilder } from "./foreign-keys.js";
import type { IndexBuilder } from "./indexes.js";
import type { PrimaryKeyBuilder } from "./primary-keys.js";
import type { UniqueConstraintBuilder } from "./unique-constraint.js";
export type SQLiteTableExtraConfigValue = IndexBuilder | CheckBuilder | ForeignKeyBuilder | PrimaryKeyBuilder | UniqueConstraintBuilder;
export type SQLiteTableExtraConfig = Record<string, SQLiteTableExtraConfigValue>;
export type TableConfig = TableConfigBase<SQLiteColumn<any>>;
export declare class SQLiteTable<T extends TableConfig = TableConfig> extends Table<T> {
    static readonly [entityKind]: string;
}
export type AnySQLiteTable<TPartial extends Partial<TableConfig> = {}> = SQLiteTable<UpdateTableConfig<TableConfig, TPartial>>;
export type SQLiteTableWithColumns<T extends TableConfig> = SQLiteTable<T> & {
    [Key in keyof T['columns']]: T['columns'][Key];
};
export interface SQLiteTableFn<TSchema extends string | undefined = undefined> {
    <TTableName extends string, TColumnsMap extends Record<string, SQLiteColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'sqlite'>) => SQLiteTableExtraConfigValue[]): SQLiteTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'sqlite'>;
        dialect: 'sqlite';
    }>;
    <TTableName extends string, TColumnsMap extends Record<string, SQLiteColumnBuilderBase>>(name: TTableName, columns: (columnTypes: SQLiteColumnBuilders) => TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'sqlite'>) => SQLiteTableExtraConfigValue[]): SQLiteTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'sqlite'>;
        dialect: 'sqlite';
    }>;
    /**
     * @deprecated The third parameter of sqliteTable is changing and will only accept an array instead of an object
     *
     * @example
     * Deprecated version:
     * ```ts
     * export const users = sqliteTable("users", {
     * 	id: int(),
     * }, (t) => ({
     * 	idx: index('custom_name').on(t.id)
     * }));
     * ```
     *
     * New API:
     * ```ts
     * export const users = sqliteTable("users", {
     * 	id: int(),
     * }, (t) => [
     * 	index('custom_name').on(t.id)
     * ]);
     * ```
     */
    <TTableName extends string, TColumnsMap extends Record<string, SQLiteColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'sqlite'>) => SQLiteTableExtraConfig): SQLiteTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'sqlite'>;
        dialect: 'sqlite';
    }>;
    /**
     * @deprecated The third parameter of sqliteTable is changing and will only accept an array instead of an object
     *
     * @example
     * Deprecated version:
     * ```ts
     * export const users = sqliteTable("users", {
     * 	id: int(),
     * }, (t) => ({
     * 	idx: index('custom_name').on(t.id)
     * }));
     * ```
     *
     * New API:
     * ```ts
     * export const users = sqliteTable("users", {
     * 	id: int(),
     * }, (t) => [
     * 	index('custom_name').on(t.id)
     * ]);
     * ```
     */
    <TTableName extends string, TColumnsMap extends Record<string, SQLiteColumnBuilderBase>>(name: TTableName, columns: (columnTypes: SQLiteColumnBuilders) => TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'sqlite'>) => SQLiteTableExtraConfig): SQLiteTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'sqlite'>;
        dialect: 'sqlite';
    }>;
}
export declare const sqliteTable: SQLiteTableFn;
export declare function sqliteTableCreator(customizeTableName: (name: string) => string): SQLiteTableFn;
