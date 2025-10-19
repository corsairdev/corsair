import type { ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, ColumnDataType, GeneratedColumnConfig, GeneratedIdentityConfig } from "./column-builder.js";
import { entityKind } from "./entity.js";
import type { DriverValueMapper, SQL, SQLWrapper } from "./sql/sql.js";
import type { Table } from "./table.js";
import type { Update } from "./utils.js";
export interface ColumnBaseConfig<TDataType extends ColumnDataType, TColumnType extends string> extends ColumnBuilderBaseConfig<TDataType, TColumnType> {
    tableName: string;
    notNull: boolean;
    hasDefault: boolean;
    isPrimaryKey: boolean;
    isAutoincrement: boolean;
    hasRuntimeDefault: boolean;
}
export type ColumnTypeConfig<T extends ColumnBaseConfig<ColumnDataType, string>, TTypeConfig extends object> = T & {
    brand: 'Column';
    tableName: T['tableName'];
    name: T['name'];
    dataType: T['dataType'];
    columnType: T['columnType'];
    data: T['data'];
    driverParam: T['driverParam'];
    notNull: T['notNull'];
    hasDefault: T['hasDefault'];
    isPrimaryKey: T['isPrimaryKey'];
    isAutoincrement: T['isAutoincrement'];
    hasRuntimeDefault: T['hasRuntimeDefault'];
    enumValues: T['enumValues'];
    baseColumn: T extends {
        baseColumn: infer U;
    } ? U : unknown;
    generated: GeneratedColumnConfig<T['data']> | undefined;
    identity: undefined | 'always' | 'byDefault';
} & TTypeConfig;
export type ColumnRuntimeConfig<TData, TRuntimeConfig extends object> = ColumnBuilderRuntimeConfig<TData, TRuntimeConfig>;
export interface Column<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TTypeConfig extends object = object> extends DriverValueMapper<T['data'], T['driverParam']>, SQLWrapper {
}
export declare abstract class Column<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TTypeConfig extends object = object> implements DriverValueMapper<T['data'], T['driverParam']>, SQLWrapper {
    readonly table: Table;
    static readonly [entityKind]: string;
    readonly _: ColumnTypeConfig<T, TTypeConfig>;
    readonly name: string;
    readonly keyAsName: boolean;
    readonly primary: boolean;
    readonly notNull: boolean;
    readonly default: T['data'] | SQL | undefined;
    readonly defaultFn: (() => T['data'] | SQL) | undefined;
    readonly onUpdateFn: (() => T['data'] | SQL) | undefined;
    readonly hasDefault: boolean;
    readonly isUnique: boolean;
    readonly uniqueName: string | undefined;
    readonly uniqueType: string | undefined;
    readonly dataType: T['dataType'];
    readonly columnType: T['columnType'];
    readonly enumValues: T['enumValues'];
    readonly generated: GeneratedColumnConfig<T['data']> | undefined;
    readonly generatedIdentity: GeneratedIdentityConfig | undefined;
    protected config: ColumnRuntimeConfig<T['data'], TRuntimeConfig>;
    constructor(table: Table, config: ColumnRuntimeConfig<T['data'], TRuntimeConfig>);
    abstract getSQLType(): string;
    mapFromDriverValue(value: unknown): unknown;
    mapToDriverValue(value: unknown): unknown;
}
export type UpdateColConfig<T extends ColumnBaseConfig<ColumnDataType, string>, TUpdate extends Partial<ColumnBaseConfig<ColumnDataType, string>>> = Update<T, TUpdate>;
export type AnyColumn<TPartial extends Partial<ColumnBaseConfig<ColumnDataType, string>> = {}> = Column<Required<Update<ColumnBaseConfig<ColumnDataType, string>, TPartial>>>;
export type GetColumnData<TColumn extends Column, TInferMode extends 'query' | 'raw' = 'query'> = TInferMode extends 'raw' ? TColumn['_']['data'] : TColumn['_']['notNull'] extends true ? TColumn['_']['data'] : TColumn['_']['data'] | null;
export type InferColumnsDataTypes<TColumns extends Record<string, Column>> = {
    [Key in keyof TColumns]: GetColumnData<TColumns[Key], 'query'>;
};
