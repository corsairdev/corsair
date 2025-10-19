import type { ColumnBuilderBaseConfig, ColumnDataType, GeneratedIdentityConfig, IsIdentity } from "../../column-builder.js";
import { entityKind } from "../../entity.js";
import type { GelSequenceOptions } from "../sequence.js";
import { GelColumnBuilder } from "./common.js";
export declare abstract class GelIntColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>> extends GelColumnBuilder<T, {
    generatedIdentity: GeneratedIdentityConfig;
}> {
    static readonly [entityKind]: string;
    generatedAlwaysAsIdentity(sequence?: GelSequenceOptions & {
        name?: string;
    }): IsIdentity<this, 'always'>;
    generatedByDefaultAsIdentity(sequence?: GelSequenceOptions & {
        name?: string;
    }): IsIdentity<this, 'byDefault'>;
}
