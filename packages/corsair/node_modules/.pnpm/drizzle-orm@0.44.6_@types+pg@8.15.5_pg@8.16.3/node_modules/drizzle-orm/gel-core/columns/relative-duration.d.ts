import type { RelativeDuration } from 'gel';
import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
export type GelRelDurationBuilderInitial<TName extends string> = GelRelDurationBuilder<{
    name: TName;
    dataType: 'relDuration';
    columnType: 'GelRelDuration';
    data: RelativeDuration;
    driverParam: RelativeDuration;
    enumValues: undefined;
}>;
export declare class GelRelDurationBuilder<T extends ColumnBuilderBaseConfig<'relDuration', 'GelRelDuration'>> extends GelColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelRelDuration<T extends ColumnBaseConfig<'relDuration', 'GelRelDuration'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function relDuration(): GelRelDurationBuilderInitial<''>;
export declare function relDuration<TName extends string>(name: TName): GelRelDurationBuilderInitial<TName>;
