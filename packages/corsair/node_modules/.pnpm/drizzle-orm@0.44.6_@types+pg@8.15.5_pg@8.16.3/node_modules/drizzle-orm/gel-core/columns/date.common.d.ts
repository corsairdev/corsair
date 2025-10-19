import type { ColumnBuilderBaseConfig, ColumnDataType } from "../../column-builder.js";
import { entityKind } from "../../entity.js";
import { GelColumnBuilder } from "./common.js";
export declare abstract class GelLocalDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends GelColumnBuilder<T, TRuntimeConfig> {
    static readonly [entityKind]: string;
    defaultNow(): import("../../column-builder.js").HasDefault<this>;
}
