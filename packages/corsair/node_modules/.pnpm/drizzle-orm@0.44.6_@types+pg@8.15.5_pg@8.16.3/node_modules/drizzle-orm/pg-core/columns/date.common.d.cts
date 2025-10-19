import type { ColumnBuilderBaseConfig, ColumnDataType } from "../../column-builder.cjs";
import { entityKind } from "../../entity.cjs";
import { PgColumnBuilder } from "./common.cjs";
export declare abstract class PgDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends PgColumnBuilder<T, TRuntimeConfig> {
    static readonly [entityKind]: string;
    defaultNow(): import("../../column-builder.ts").HasDefault<this>;
}
