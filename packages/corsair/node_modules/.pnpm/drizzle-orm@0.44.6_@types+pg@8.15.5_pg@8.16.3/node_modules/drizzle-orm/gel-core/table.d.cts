import type { BuildColumns, BuildExtraConfigColumns } from "../column-builder.cjs";
import { entityKind } from "../entity.cjs";
import { Table, type TableConfig as TableConfigBase, type UpdateTableConfig } from "../table.cjs";
import type { CheckBuilder } from "./checks.cjs";
import { type GelColumnsBuilders } from "./columns/all.cjs";
import type { GelColumn, GelColumnBuilderBase } from "./columns/common.cjs";
import type { ForeignKeyBuilder } from "./foreign-keys.cjs";
import type { AnyIndexBuilder } from "./indexes.cjs";
import type { GelPolicy } from "./policies.cjs";
import type { PrimaryKeyBuilder } from "./primary-keys.cjs";
import type { UniqueConstraintBuilder } from "./unique-constraint.cjs";
export type GelTableExtraConfigValue = AnyIndexBuilder | CheckBuilder | ForeignKeyBuilder | PrimaryKeyBuilder | UniqueConstraintBuilder | GelPolicy;
export type GelTableExtraConfig = Record<string, GelTableExtraConfigValue>;
export type TableConfig = TableConfigBase<GelColumn>;
export declare class GelTable<T extends TableConfig = TableConfig> extends Table<T> {
    static readonly [entityKind]: string;
}
export type AnyGelTable<TPartial extends Partial<TableConfig> = {}> = GelTable<UpdateTableConfig<TableConfig, TPartial>>;
export type GelTableWithColumns<T extends TableConfig> = GelTable<T> & {
    [Key in keyof T['columns']]: T['columns'][Key];
} & {
    enableRLS: () => Omit<GelTableWithColumns<T>, 'enableRLS'>;
};
export interface GelTableFn<TSchema extends string | undefined = undefined> {
    /**
     * @deprecated The third parameter of GelTable is changing and will only accept an array instead of an object
     *
     * @example
     * Deprecated version:
     * ```ts
     * export const users = gelTable("users", {
     * 	id: integer(),
     * }, (t) => ({
     * 	idx: index('custom_name').on(t.id)
     * }));
     * ```
     *
     * New API:
     * ```ts
     * export const users = gelTable("users", {
     * 	id: integer(),
     * }, (t) => [
     * 	index('custom_name').on(t.id)
     * ]);
     * ```
     */
    <TTableName extends string, TColumnsMap extends Record<string, GelColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'gel'>) => GelTableExtraConfig): GelTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'gel'>;
        dialect: 'gel';
    }>;
    /**
     * @deprecated The third parameter of gelTable is changing and will only accept an array instead of an object
     *
     * @example
     * Deprecated version:
     * ```ts
     * export const users = gelTable("users", {
     * 	id: integer(),
     * }, (t) => ({
     * 	idx: index('custom_name').on(t.id)
     * }));
     * ```
     *
     * New API:
     * ```ts
     * export const users = gelTable("users", {
     * 	id: integer(),
     * }, (t) => [
     * 	index('custom_name').on(t.id)
     * ]);
     * ```
     */
    <TTableName extends string, TColumnsMap extends Record<string, GelColumnBuilderBase>>(name: TTableName, columns: (columnTypes: GelColumnsBuilders) => TColumnsMap, extraConfig: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'gel'>) => GelTableExtraConfig): GelTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'gel'>;
        dialect: 'gel';
    }>;
    <TTableName extends string, TColumnsMap extends Record<string, GelColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'gel'>) => GelTableExtraConfigValue[]): GelTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'gel'>;
        dialect: 'gel';
    }>;
    <TTableName extends string, TColumnsMap extends Record<string, GelColumnBuilderBase>>(name: TTableName, columns: (columnTypes: GelColumnsBuilders) => TColumnsMap, extraConfig?: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'gel'>) => GelTableExtraConfigValue[]): GelTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'gel'>;
        dialect: 'gel';
    }>;
}
export declare const gelTable: GelTableFn;
export declare function gelTableCreator(customizeTableName: (name: string) => string): GelTableFn;
