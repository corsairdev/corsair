import type { ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnDataType, HasDefault } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
export interface SingleStoreDateColumnBaseConfig {
    hasOnUpdateNow: boolean;
}
export declare abstract class SingleStoreDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends SingleStoreColumnBuilder<T, TRuntimeConfig & SingleStoreDateColumnBaseConfig, TExtraConfig> {
    static readonly [entityKind]: string;
    defaultNow(): HasDefault<this>;
    onUpdateNow(): HasDefault<this>;
}
export declare abstract class SingleStoreDateBaseColumn<T extends ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends SingleStoreColumn<T, SingleStoreDateColumnBaseConfig & TRuntimeConfig> {
    static readonly [entityKind]: string;
    readonly hasOnUpdateNow: boolean;
}
