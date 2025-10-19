import type { BuildColumns } from "../column-builder.cjs";
import { entityKind } from "../entity.cjs";
import { Table, type TableConfig as TableConfigBase, type UpdateTableConfig } from "../table.cjs";
import { type SingleStoreColumnBuilders } from "./columns/all.cjs";
import type { SingleStoreColumn, SingleStoreColumnBuilderBase } from "./columns/common.cjs";
import type { AnyIndexBuilder } from "./indexes.cjs";
import type { PrimaryKeyBuilder } from "./primary-keys.cjs";
import type { UniqueConstraintBuilder } from "./unique-constraint.cjs";
export type SingleStoreTableExtraConfigValue = AnyIndexBuilder | PrimaryKeyBuilder | UniqueConstraintBuilder;
export type SingleStoreTableExtraConfig = Record<string, SingleStoreTableExtraConfigValue>;
export type TableConfig = TableConfigBase<SingleStoreColumn>;
export declare class SingleStoreTable<T extends TableConfig = TableConfig> extends Table<T> {
    static readonly [entityKind]: string;
    protected $columns: T['columns'];
}
export type AnySingleStoreTable<TPartial extends Partial<TableConfig> = {}> = SingleStoreTable<UpdateTableConfig<TableConfig, TPartial>>;
export type SingleStoreTableWithColumns<T extends TableConfig> = SingleStoreTable<T> & {
    [Key in keyof T['columns']]: T['columns'][Key];
};
export declare function singlestoreTableWithSchema<TTableName extends string, TSchemaName extends string | undefined, TColumnsMap extends Record<string, SingleStoreColumnBuilderBase>>(name: TTableName, columns: TColumnsMap | ((columnTypes: SingleStoreColumnBuilders) => TColumnsMap), extraConfig: ((self: BuildColumns<TTableName, TColumnsMap, 'singlestore'>) => SingleStoreTableExtraConfig | SingleStoreTableExtraConfigValue[]) | undefined, schema: TSchemaName, baseName?: TTableName): SingleStoreTableWithColumns<{
    name: TTableName;
    schema: TSchemaName;
    columns: BuildColumns<TTableName, TColumnsMap, 'singlestore'>;
    dialect: 'singlestore';
}>;
export interface SingleStoreTableFn<TSchemaName extends string | undefined = undefined> {
    <TTableName extends string, TColumnsMap extends Record<string, SingleStoreColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'singlestore'>) => SingleStoreTableExtraConfigValue[]): SingleStoreTableWithColumns<{
        name: TTableName;
        schema: TSchemaName;
        columns: BuildColumns<TTableName, TColumnsMap, 'singlestore'>;
        dialect: 'singlestore';
    }>;
    <TTableName extends string, TColumnsMap extends Record<string, SingleStoreColumnBuilderBase>>(name: TTableName, columns: (columnTypes: SingleStoreColumnBuilders) => TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'singlestore'>) => SingleStoreTableExtraConfigValue[]): SingleStoreTableWithColumns<{
        name: TTableName;
        schema: TSchemaName;
        columns: BuildColumns<TTableName, TColumnsMap, 'singlestore'>;
        dialect: 'singlestore';
    }>;
    /**
     * @deprecated The third parameter of singlestoreTable is changing and will only accept an array instead of an object
     *
     * @example
     * Deprecated version:
     * ```ts
     * export const users = singlestoreTable("users", {
     * 	id: int(),
     * }, (t) => ({
     * 	idx: index('custom_name').on(t.id)
     * }));
     * ```
     *
     * New API:
     * ```ts
     * export const users = singlestoreTable("users", {
     * 	id: int(),
     * }, (t) => [
     * 	index('custom_name').on(t.id)
     * ]);
     * ```
     */
    <TTableName extends string, TColumnsMap extends Record<string, SingleStoreColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'singlestore'>) => SingleStoreTableExtraConfig): SingleStoreTableWithColumns<{
        name: TTableName;
        schema: TSchemaName;
        columns: BuildColumns<TTableName, TColumnsMap, 'singlestore'>;
        dialect: 'singlestore';
    }>;
    /**
     * @deprecated The third parameter of singlestoreTable is changing and will only accept an array instead of an object
     *
     * @example
     * Deprecated version:
     * ```ts
     * export const users = singlestoreTable("users", {
     * 	id: int(),
     * }, (t) => ({
     * 	idx: index('custom_name').on(t.id)
     * }));
     * ```
     *
     * New API:
     * ```ts
     * export const users = singlestoreTable("users", {
     * 	id: int(),
     * }, (t) => [
     * 	index('custom_name').on(t.id)
     * ]);
     * ```
     */
    <TTableName extends string, TColumnsMap extends Record<string, SingleStoreColumnBuilderBase>>(name: TTableName, columns: (columnTypes: SingleStoreColumnBuilders) => TColumnsMap, extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'singlestore'>) => SingleStoreTableExtraConfig): SingleStoreTableWithColumns<{
        name: TTableName;
        schema: TSchemaName;
        columns: BuildColumns<TTableName, TColumnsMap, 'singlestore'>;
        dialect: 'singlestore';
    }>;
}
export declare const singlestoreTable: SingleStoreTableFn;
export declare function singlestoreTableCreator(customizeTableName: (name: string) => string): SingleStoreTableFn;
