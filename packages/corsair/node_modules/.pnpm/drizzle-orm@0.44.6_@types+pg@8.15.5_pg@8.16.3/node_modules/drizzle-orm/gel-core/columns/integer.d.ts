import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelIntColumnBaseBuilder } from "./int.common.js";
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
