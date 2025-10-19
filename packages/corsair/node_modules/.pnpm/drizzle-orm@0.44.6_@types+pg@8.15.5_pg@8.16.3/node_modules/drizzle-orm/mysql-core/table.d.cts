import type { BuildColumns } from "../column-builder.cjs";
import { entityKind } from "../entity.cjs";
import { Table, type TableConfig as TableConfigBase, type UpdateTableConfig } from "../table.cjs";
import type { CheckBuilder } from "./checks.cjs";
import { type MySqlColumnBuilders } from "./columns/all.cjs";
import type { MySqlColumn, MySqlColumnBuilderBase } from "./columns/common.cjs";
import type { ForeignKeyBuilder } from "./foreign-keys.cjs";
import type { AnyIndexBuilder } from "./indexes.cjs";
import type { PrimaryKeyBuilder } from "./primary-keys.cjs";
import type { UniqueConstraintBuilder } from "./unique-constraint.cjs";
export type MySqlTableExtraConfigValue = AnyIndexBuilder | CheckBuilder | ForeignKeyBuilder | PrimaryKeyBuilder | UniqueConstraintBuilder;
export type MySqlTableExtraConfig = Record<string, MySqlTableExtraConfigValue>;
export type TableConfig = TableConfigBase<MySqlColumn>;
export declare class MySqlTable<T extends TableConfig = TableConfig> extends Table<T> {
    static readonly [entityKind]: string;
    protected $columns: T['columns'];
}
export type AnyMySqlTable<TPartial extends Partial<TableConfig> = {}> = MySqlTable<UpdateTableConfig<TableConfig, TPartial>>;
export type MySqlTableWithColumns<T extends TableConfig> = MySqlTable<T> & {
    [Key in keyof T['columns']]: T['columns'][Key];
};
export declare function mysqlTableWithSchema<TTableName extends string, TSchemaName extends string | undefined, TColumnsMap extends Record<string, MySqlColumnBuilderBase>>(name: TTableName, columns: TColumnsMap | ((columnTypes: MySqlColumnBuilders) => TColumnsMap), extraConfig: ((self: BuildColumns<TTableName, TColumnsMap, 'mysql'>) => MySqlTableExtraConfig | MySqlTableExtraConfigValue[]) | undefined, schema: TSchemaName, baseName?: TTableName): MySqlTableWithColumns<{
    name: TTableName;
    schema: TSchemaName;
    columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
    dialect: 'mysql';
}>;
export interface MySqlTableFn<TSchemaName extends string | undefined = undefined> {
    <TTableName extends string, TColumnsMap extends Record<string, MySqlColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'mysql'>) => MySqlTableExtraConfigValue[]): MySqlTableWithColumns<{
        name: TTableName;
        schema: TSchemaName;
        columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
        dialect: 'mysql';
    }>;
    <TTableName extends string, TColumnsMap extends Record<string, MySqlColumnBuilderBase>>(name: TTableName, columns: (columnTypes: MySqlColumnBuilders) => TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'mysql'>) => MySqlTableExtraConfigValue[]): MySqlTableWithColumns<{
        name: TTableName;
        schema: TSchemaName;
        columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
        dialect: 'mysql';
    }>;
    /**
     * @deprecated The third parameter of mysqlTable is changing and will only accept an array instead of an object
     *
     * @example
     * Deprecated version:
     * ```ts
     * export const users = mysqlTable("users", {
     * 	id: int(),
     * }, (t) => ({
     * 	idx: index('custom_name').on(t.id)
     * }));
     * ```
     *
     * New API:
     * ```ts
     * export const users = mysqlTable("users", {
     * 	id: int(),
     * }, (t) => [
     * 	index('custom_name').on(t.id)
     * ]);
     * ```
     */
    <TTableName extends string, TColumnsMap extends Record<string, MySqlColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig: (self: BuildColumns<TTableName, TColumnsMap, 'mysql'>) => MySqlTableExtraConfig): MySqlTableWithColumns<{
        name: TTableName;
        schema: TSchemaName;
        columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
        dialect: 'mysql';
    }>;
    /**
     * @deprecated The third parameter of mysqlTable is changing and will only accept an array instead of an object
     *
     * @example
     * Deprecated version:
     * ```ts
     * export const users = mysqlTable("users", {
     * 	id: int(),
     * }, (t) => ({
     * 	idx: index('custom_name').on(t.id)
     * }));
     * ```
     *
     * New API:
     * ```ts
     * export const users = mysqlTable("users", {
     * 	id: int(),
     * }, (t) => [
     * 	index('custom_name').on(t.id)
     * ]);
     * ```
     */
    <TTableName extends string, TColumnsMap extends Record<string, MySqlColumnBuilderBase>>(name: TTableName, columns: (columnTypes: MySqlColumnBuilders) => TColumnsMap, extraConfig: (self: BuildColumns<TTableName, TColumnsMap, 'mysql'>) => MySqlTableExtraConfig): MySqlTableWithColumns<{
        name: TTableName;
        schema: TSchemaName;
        columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
        dialect: 'mysql';
    }>;
}
export declare const mysqlTable: MySqlTableFn;
export declare function mysqlTableCreator(customizeTableName: (name: string) => string): MySqlTableFn;
