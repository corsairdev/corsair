import type { ColumnBuilderBaseConfig, ColumnDataType, GeneratedIdentityConfig, IsIdentity } from "../../column-builder.cjs";
import { entityKind } from "../../entity.cjs";
import type { GelSequenceOptions } from "../sequence.cjs";
import { GelColumnBuilder } from "./common.cjs";
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
