import type { ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnDataType, HasDefault } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
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
