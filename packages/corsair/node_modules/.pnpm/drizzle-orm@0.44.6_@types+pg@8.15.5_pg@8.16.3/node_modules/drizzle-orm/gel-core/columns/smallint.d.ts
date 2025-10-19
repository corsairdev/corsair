import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelIntColumnBaseBuilder } from "./int.common.js";
export type GelSmallIntBuilderInitial<TName extends string> = GelSmallIntBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'GelSmallInt';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>;
export declare class GelSmallIntBuilder<T extends ColumnBuilderBaseConfig<'number', 'GelSmallInt'>> extends GelIntColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelSmallInt<T extends ColumnBaseConfig<'number', 'GelSmallInt'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function smallint(): GelSmallIntBuilderInitial<''>;
export declare function smallint<TName extends string>(name: TName): GelSmallIntBuilderInitial<TName>;
