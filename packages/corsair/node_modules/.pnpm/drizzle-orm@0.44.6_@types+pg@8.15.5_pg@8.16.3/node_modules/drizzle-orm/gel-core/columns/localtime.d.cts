import type { LocalTime } from 'gel';
import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { GelColumn } from "./common.cjs";
import { GelLocalDateColumnBaseBuilder } from "./date.common.cjs";
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
