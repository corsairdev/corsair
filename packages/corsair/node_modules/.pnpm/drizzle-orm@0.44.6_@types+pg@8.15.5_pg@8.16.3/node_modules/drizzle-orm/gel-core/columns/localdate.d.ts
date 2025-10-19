import type { LocalDate } from 'gel';
import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
export type GelLocalDateStringBuilderInitial<TName extends string> = GelLocalDateStringBuilder<{
    name: TName;
    dataType: 'localDate';
    columnType: 'GelLocalDateString';
    data: LocalDate;
    driverParam: LocalDate;
    enumValues: undefined;
}>;
export declare class GelLocalDateStringBuilder<T extends ColumnBuilderBaseConfig<'localDate', 'GelLocalDateString'>> extends GelLocalDateColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelLocalDateString<T extends ColumnBaseConfig<'localDate', 'GelLocalDateString'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function localDate(): GelLocalDateStringBuilderInitial<''>;
export declare function localDate<TName extends string>(name: TName): GelLocalDateStringBuilderInitial<TName>;
