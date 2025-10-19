import type { DateDuration } from 'gel';
import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { GelColumn, GelColumnBuilder } from "./common.cjs";
export type GelDateDurationBuilderInitial<TName extends string> = GelDateDurationBuilder<{
    name: TName;
    dataType: 'dateDuration';
    columnType: 'GelDateDuration';
    data: DateDuration;
    driverParam: DateDuration;
    enumValues: undefined;
}>;
export declare class GelDateDurationBuilder<T extends ColumnBuilderBaseConfig<'dateDuration', 'GelDateDuration'>> extends GelColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelDateDuration<T extends ColumnBaseConfig<'dateDuration', 'GelDateDuration'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function dateDuration(): GelDateDurationBuilderInitial<''>;
export declare function dateDuration<TName extends string>(name: TName): GelDateDurationBuilderInitial<TName>;
