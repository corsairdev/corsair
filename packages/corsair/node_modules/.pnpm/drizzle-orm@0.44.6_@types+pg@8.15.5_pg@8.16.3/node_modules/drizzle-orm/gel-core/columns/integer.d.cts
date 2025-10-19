import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { GelColumn } from "./common.cjs";
import { GelIntColumnBaseBuilder } from "./int.common.cjs";
export type GelIntegerBuilderInitial<TName extends string> = GelIntegerBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'GelInteger';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>;
export declare class GelIntegerBuilder<T extends ColumnBuilderBaseConfig<'number', 'GelInteger'>> extends GelIntColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelInteger<T extends ColumnBaseConfig<'number', 'GelInteger'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function integer(): GelIntegerBuilderInitial<''>;
export declare function integer<TName extends string>(name: TName): GelIntegerBuilderInitial<TName>;
