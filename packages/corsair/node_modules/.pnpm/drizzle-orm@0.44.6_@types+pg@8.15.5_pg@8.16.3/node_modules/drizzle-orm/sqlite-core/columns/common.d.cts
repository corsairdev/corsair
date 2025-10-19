import type { ColumnBuilderBase, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnDataType, HasGenerated } from "../../column-builder.cjs";
import { ColumnBuilder } from "../../column-builder.cjs";
import { Column } from "../../column.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { SQL } from "../../sql/sql.cjs";
import type { UpdateDeleteAction } from "../foreign-keys.cjs";
import type { SQLiteTable } from "../table.cjs";
import type { Update } from "../../utils.cjs";
export interface ReferenceConfig {
    ref: () => SQLiteColumn;
    actions: {
        onUpdate?: UpdateDeleteAction;
        onDelete?: UpdateDeleteAction;
    };
}
export interface SQLiteColumnBuilderBase<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TTypeConfig extends object = object> extends ColumnBuilderBase<T, TTypeConfig & {
    dialect: 'sqlite';
}> {
}
export interface SQLiteGeneratedColumnConfig {
    mode?: 'virtual' | 'stored';
}
export declare abstract class SQLiteColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TTypeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = object> extends ColumnBuilder<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'sqlite';
}, TExtraConfig> implements SQLiteColumnBuilderBase<T, TTypeConfig> {
    static readonly [entityKind]: string;
    private foreignKeyConfigs;
    references(ref: ReferenceConfig['ref'], actions?: ReferenceConfig['actions']): this;
    unique(name?: string): this;
    generatedAlwaysAs(as: SQL | T['data'] | (() => SQL), config?: SQLiteGeneratedColumnConfig): HasGenerated<this, {
        type: 'always';
    }>;
}
export declare abstract class SQLiteColumn<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = {}, TTypeConfig extends object = {}> extends Column<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'sqlite';
}> {
    readonly table: SQLiteTable;
    static readonly [entityKind]: string;
    constructor(table: SQLiteTable, config: ColumnBuilderRuntimeConfig<T['data'], TRuntimeConfig>);
}
export type AnySQLiteColumn<TPartial extends Partial<ColumnBaseConfig<ColumnDataType, string>> = {}> = SQLiteColumn<Required<Update<ColumnBaseConfig<ColumnDataType, string>, TPartial>>>;
