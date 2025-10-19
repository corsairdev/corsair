import type { ColumnBuilderBaseConfig, ColumnDataType, GeneratedIdentityConfig, IsIdentity } from "../../column-builder.cjs";
import { entityKind } from "../../entity.cjs";
import type { PgSequenceOptions } from "../sequence.cjs";
import { PgColumnBuilder } from "./common.cjs";
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
