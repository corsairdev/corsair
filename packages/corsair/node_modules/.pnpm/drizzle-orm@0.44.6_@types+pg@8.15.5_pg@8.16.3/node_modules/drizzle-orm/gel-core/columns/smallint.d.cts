import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { GelColumn } from "./common.cjs";
import { GelIntColumnBaseBuilder } from "./int.common.cjs";
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
