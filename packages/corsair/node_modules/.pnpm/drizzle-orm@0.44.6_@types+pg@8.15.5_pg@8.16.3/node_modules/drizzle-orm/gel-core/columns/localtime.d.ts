import type { LocalTime } from 'gel';
import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
export type GelLocalTimeBuilderInitial<TName extends string> = GelLocalTimeBuilder<{
    name: TName;
    dataType: 'localTime';
    columnType: 'GelLocalTime';
    data: LocalTime;
    driverParam: LocalTime;
    enumValues: undefined;
}>;
export declare class GelLocalTimeBuilder<T extends ColumnBuilderBaseConfig<'localTime', 'GelLocalTime'>> extends GelLocalDateColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelLocalTime<T extends ColumnBaseConfig<'localTime', 'GelLocalTime'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function localTime(): GelLocalTimeBuilderInitial<''>;
export declare function localTime<TName extends string>(name: TName): GelLocalTimeBuilderInitial<TName>;
