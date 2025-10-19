import type { Duration } from 'gel';
import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
export type GelDurationBuilderInitial<TName extends string> = GelDurationBuilder<{
    name: TName;
    dataType: 'duration';
    columnType: 'GelDuration';
    data: Duration;
    driverParam: Duration;
    enumValues: undefined;
}>;
export declare class GelDurationBuilder<T extends ColumnBuilderBaseConfig<'duration', 'GelDuration'>> extends GelColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelDuration<T extends ColumnBaseConfig<'duration', 'GelDuration'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function duration(): GelDurationBuilderInitial<''>;
export declare function duration<TName extends string>(name: TName): GelDurationBuilderInitial<TName>;
