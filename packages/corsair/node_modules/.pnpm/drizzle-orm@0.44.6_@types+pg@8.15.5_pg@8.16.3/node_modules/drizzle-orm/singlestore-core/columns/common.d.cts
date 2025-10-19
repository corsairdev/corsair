import type { ColumnBuilderBase, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnDataType, HasDefault, IsAutoincrement } from "../../column-builder.cjs";
import { ColumnBuilder } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { Column } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { SingleStoreTable } from "../table.cjs";
import type { Update } from "../../utils.cjs";
export interface SingleStoreColumnBuilderBase<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TTypeConfig extends object = object> extends ColumnBuilderBase<T, TTypeConfig & {
    dialect: 'singlestore';
}> {
}
export interface SingleStoreGeneratedColumnConfig {
    mode?: 'virtual' | 'stored';
}
export declare abstract class SingleStoreColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string> & {
    data: any;
}, TRuntimeConfig extends object = object, TTypeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends ColumnBuilder<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'singlestore';
}, TExtraConfig> implements SingleStoreColumnBuilderBase<T, TTypeConfig> {
    static readonly [entityKind]: string;
    unique(name?: string): this;
}
export declare abstract class SingleStoreColumn<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = {}, TTypeConfig extends object = {}> extends Column<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'singlestore';
}> {
    readonly table: SingleStoreTable;
    static readonly [entityKind]: string;
    constructor(table: SingleStoreTable, config: ColumnBuilderRuntimeConfig<T['data'], TRuntimeConfig>);
}
export type AnySingleStoreColumn<TPartial extends Partial<ColumnBaseConfig<ColumnDataType, string>> = {}> = SingleStoreColumn<Required<Update<ColumnBaseConfig<ColumnDataType, string>, TPartial>>>;
export interface SingleStoreColumnWithAutoIncrementConfig {
    autoIncrement: boolean;
}
export declare abstract class SingleStoreColumnBuilderWithAutoIncrement<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends SingleStoreColumnBuilder<T, TRuntimeConfig & SingleStoreColumnWithAutoIncrementConfig, TExtraConfig> {
    static readonly [entityKind]: string;
    constructor(name: NonNullable<T['name']>, dataType: T['dataType'], columnType: T['columnType']);
    autoincrement(): IsAutoincrement<HasDefault<this>>;
}
export declare abstract class SingleStoreColumnWithAutoIncrement<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends SingleStoreColumn<T, SingleStoreColumnWithAutoIncrementConfig & TRuntimeConfig> {
    static readonly [entityKind]: string;
    readonly autoIncrement: boolean;
}
