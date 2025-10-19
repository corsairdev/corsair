import type { ColumnBuilderBaseConfig, ColumnDataType } from "../../column-builder.cjs";
import { entityKind } from "../../entity.cjs";
import { GelColumnBuilder } from "./common.cjs";
export declare abstract class GelLocalDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends GelColumnBuilder<T, TRuntimeConfig> {
    static readonly [entityKind]: string;
    defaultNow(): import("../../column-builder.ts").HasDefault<this>;
}
