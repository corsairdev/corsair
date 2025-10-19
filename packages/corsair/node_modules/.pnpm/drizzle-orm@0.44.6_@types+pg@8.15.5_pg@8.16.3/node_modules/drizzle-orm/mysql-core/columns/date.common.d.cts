import type { ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnDataType, HasDefault } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { MySqlColumn, MySqlColumnBuilder } from "./common.cjs";
export interface MySqlDateColumnBaseConfig {
    hasOnUpdateNow: boolean;
}
export declare abstract class MySqlDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends MySqlColumnBuilder<T, TRuntimeConfig & MySqlDateColumnBaseConfig, TExtraConfig> {
    static readonly [entityKind]: string;
    defaultNow(): HasDefault<this>;
    onUpdateNow(): HasDefault<this>;
}
export declare abstract class MySqlDateBaseColumn<T extends ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends MySqlColumn<T, MySqlDateColumnBaseConfig & TRuntimeConfig> {
    static readonly [entityKind]: string;
    readonly hasOnUpdateNow: boolean;
}
