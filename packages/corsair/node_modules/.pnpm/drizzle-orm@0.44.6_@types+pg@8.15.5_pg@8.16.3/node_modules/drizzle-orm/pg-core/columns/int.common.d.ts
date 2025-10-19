import type { ColumnBuilderBaseConfig, ColumnDataType, GeneratedIdentityConfig, IsIdentity } from "../../column-builder.js";
import { entityKind } from "../../entity.js";
import type { PgSequenceOptions } from "../sequence.js";
import { PgColumnBuilder } from "./common.js";
export declare abstract class PgIntColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>> extends PgColumnBuilder<T, {
    generatedIdentity: GeneratedIdentityConfig;
}> {
    static readonly [entityKind]: string;
    generatedAlwaysAsIdentity(sequence?: PgSequenceOptions & {
        name?: string;
    }): IsIdentity<this, 'always'>;
    generatedByDefaultAsIdentity(sequence?: PgSequenceOptions & {
        name?: string;
    }): IsIdentity<this, 'byDefault'>;
}
