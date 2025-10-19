import { ColumnBuilder } from "../../column-builder.cjs";
import type { ColumnBuilderBase, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnDataType, HasDefault, HasGenerated, IsAutoincrement } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { Column } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { UpdateDeleteAction } from "../foreign-keys.cjs";
import type { MySqlTable } from "../table.cjs";
import type { SQL } from "../../sql/sql.cjs";
import type { Update } from "../../utils.cjs";
export interface ReferenceConfig {
    ref: () => MySqlColumn;
    actions: {
        onUpdate?: UpdateDeleteAction;
        onDelete?: UpdateDeleteAction;
    };
}
export interface MySqlColumnBuilderBase<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TTypeConfig extends object = object> extends ColumnBuilderBase<T, TTypeConfig & {
    dialect: 'mysql';
}> {
}
export interface MySqlGeneratedColumnConfig {
    mode?: 'virtual' | 'stored';
}
export declare abstract class MySqlColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string> & {
    data: any;
}, TRuntimeConfig extends object = object, TTypeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends ColumnBuilder<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'mysql';
}, TExtraConfig> implements MySqlColumnBuilderBase<T, TTypeConfig> {
    static readonly [entityKind]: string;
    private foreignKeyConfigs;
    references(ref: ReferenceConfig['ref'], actions?: ReferenceConfig['actions']): this;
    unique(name?: string): this;
    generatedAlwaysAs(as: SQL | T['data'] | (() => SQL), config?: MySqlGeneratedColumnConfig): HasGenerated<this, {
        type: 'always';
    }>;
}
export declare abstract class MySqlColumn<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = {}, TTypeConfig extends object = {}> extends Column<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'mysql';
}> {
    readonly table: MySqlTable;
    static readonly [entityKind]: string;
    constructor(table: MySqlTable, config: ColumnBuilderRuntimeConfig<T['data'], TRuntimeConfig>);
}
export type AnyMySqlColumn<TPartial extends Partial<ColumnBaseConfig<ColumnDataType, string>> = {}> = MySqlColumn<Required<Update<ColumnBaseConfig<ColumnDataType, string>, TPartial>>>;
export interface MySqlColumnWithAutoIncrementConfig {
    autoIncrement: boolean;
}
export declare abstract class MySqlColumnBuilderWithAutoIncrement<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends MySqlColumnBuilder<T, TRuntimeConfig & MySqlColumnWithAutoIncrementConfig, TExtraConfig> {
    static readonly [entityKind]: string;
    constructor(name: NonNullable<T['name']>, dataType: T['dataType'], columnType: T['columnType']);
    autoincrement(): IsAutoincrement<HasDefault<this>>;
}
export declare abstract class MySqlColumnWithAutoIncrement<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends MySqlColumn<T, MySqlColumnWithAutoIncrementConfig & TRuntimeConfig> {
    static readonly [entityKind]: string;
    readonly autoIncrement: boolean;
}
