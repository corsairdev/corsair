import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
export type GelDoublePrecisionBuilderInitial<TName extends string> = GelDoublePrecisionBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'GelDoublePrecision';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>;
export declare class GelDoublePrecisionBuilder<T extends ColumnBuilderBaseConfig<'number', 'GelDoublePrecision'>> extends GelColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelDoublePrecision<T extends ColumnBaseConfig<'number', 'GelDoublePrecision'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string | number): number;
}
export declare function doublePrecision(): GelDoublePrecisionBuilderInitial<''>;
export declare function doublePrecision<TName extends string>(name: TName): GelDoublePrecisionBuilderInitial<TName>;
