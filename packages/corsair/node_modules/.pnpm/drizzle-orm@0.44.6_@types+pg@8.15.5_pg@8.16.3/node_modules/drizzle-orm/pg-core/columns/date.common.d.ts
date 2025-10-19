import type { ColumnBuilderBaseConfig, ColumnDataType } from "../../column-builder.js";
import { entityKind } from "../../entity.js";
import { PgColumnBuilder } from "./common.js";
export declare abstract class PgDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends PgColumnBuilder<T, TRuntimeConfig> {
    static readonly [entityKind]: string;
    defaultNow(): import("../../column-builder.js").HasDefault<this>;
}
