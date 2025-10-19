import type { BuildColumns, BuildExtraConfigColumns } from "../column-builder.cjs";
import { entityKind } from "../entity.cjs";
import { Table, type TableConfig as TableConfigBase, type UpdateTableConfig } from "../table.cjs";
import type { CheckBuilder } from "./checks.cjs";
import { type PgColumnsBuilders } from "./columns/all.cjs";
import type { PgColumn, PgColumnBuilderBase } from "./columns/common.cjs";
import type { ForeignKeyBuilder } from "./foreign-keys.cjs";
import type { AnyIndexBuilder } from "./indexes.cjs";
import type { PgPolicy } from "./policies.cjs";
import type { PrimaryKeyBuilder } from "./primary-keys.cjs";
import type { UniqueConstraintBuilder } from "./unique-constraint.cjs";
export type PgTableExtraConfigValue = AnyIndexBuilder | CheckBuilder | ForeignKeyBuilder | PrimaryKeyBuilder | UniqueConstraintBuilder | PgPolicy;
export type PgTableExtraConfig = Record<string, PgTableExtraConfigValue>;
export type TableConfig = TableConfigBase<PgColumn>;
export declare class PgTable<T extends TableConfig = TableConfig> extends Table<T> {
    static readonly [entityKind]: string;
}
export type AnyPgTable<TPartial extends Partial<TableConfig> = {}> = PgTable<UpdateTableConfig<TableConfig, TPartial>>;
export type PgTableWithColumns<T extends TableConfig> = PgTable<T> & {
    [Key in keyof T['columns']]: T['columns'][Key];
} & {
    enableRLS: () => Omit<PgTableWithColumns<T>, 'enableRLS'>;
};
export interface PgTableFn<TSchema extends string | undefined = undefined> {
    <TTableName extends string, TColumnsMap extends Record<string, PgColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig?: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'pg'>) => PgTableExtraConfigValue[]): PgTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'pg'>;
        dialect: 'pg';
    }>;
    <TTableName extends string, TColumnsMap extends Record<string, PgColumnBuilderBase>>(name: TTableName, columns: (columnTypes: PgColumnsBuilders) => TColumnsMap, extraConfig?: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'pg'>) => PgTableExtraConfigValue[]): PgTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'pg'>;
        dialect: 'pg';
    }>;
    /**
     * @deprecated The third parameter of pgTable is changing and will only accept an array instead of an object
     *
     * @example
     * Deprecated version:
     * ```ts
     * export const users = pgTable("users", {
     * 	id: integer(),
     * }, (t) => ({
     * 	idx: index('custom_name').on(t.id)
     * }));
     * ```
     *
     * New API:
     * ```ts
     * export const users = pgTable("users", {
     * 	id: integer(),
     * }, (t) => [
     * 	index('custom_name').on(t.id)
     * ]);
     * ```
     */
    <TTableName extends string, TColumnsMap extends Record<string, PgColumnBuilderBase>>(name: TTableName, columns: TColumnsMap, extraConfig: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'pg'>) => PgTableExtraConfig): PgTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'pg'>;
        dialect: 'pg';
    }>;
    /**
     * @deprecated The third parameter of pgTable is changing and will only accept an array instead of an object
     *
     * @example
     * Deprecated version:
     * ```ts
     * export const users = pgTable("users", {
     * 	id: integer(),
     * }, (t) => ({
     * 	idx: index('custom_name').on(t.id)
     * }));
     * ```
     *
     * New API:
     * ```ts
     * export const users = pgTable("users", {
     * 	id: integer(),
     * }, (t) => [
     * 	index('custom_name').on(t.id)
     * ]);
     * ```
     */
    <TTableName extends string, TColumnsMap extends Record<string, PgColumnBuilderBase>>(name: TTableName, columns: (columnTypes: PgColumnsBuilders) => TColumnsMap, extraConfig: (self: BuildExtraConfigColumns<TTableName, TColumnsMap, 'pg'>) => PgTableExtraConfig): PgTableWithColumns<{
        name: TTableName;
        schema: TSchema;
        columns: BuildColumns<TTableName, TColumnsMap, 'pg'>;
        dialect: 'pg';
    }>;
}
export declare const pgTable: PgTableFn;
export declare function pgTableCreator(customizeTableName: (name: string) => string): PgTableFn;
