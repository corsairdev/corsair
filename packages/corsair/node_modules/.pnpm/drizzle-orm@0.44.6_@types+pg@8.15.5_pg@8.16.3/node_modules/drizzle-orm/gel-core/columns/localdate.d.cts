import type { LocalDate } from 'gel';
import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { GelColumn } from "./common.cjs";
import { GelLocalDateColumnBaseBuilder } from "./date.common.cjs";
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
