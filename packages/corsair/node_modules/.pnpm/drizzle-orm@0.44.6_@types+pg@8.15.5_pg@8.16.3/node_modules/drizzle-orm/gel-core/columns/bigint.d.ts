import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { GelColumn } from "./common.js";
import { GelIntColumnBaseBuilder } from "./int.common.js";
export type GelInt53BuilderInitial<TName extends string> = GelInt53Builder<{
    name: TName;
    dataType: 'number';
    columnType: 'GelInt53';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>;
export declare class GelInt53Builder<T extends ColumnBuilderBaseConfig<'number', 'GelInt53'>> extends GelIntColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelInt53<T extends ColumnBaseConfig<'number', 'GelInt53'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function bigint(): GelInt53BuilderInitial<''>;
export declare function bigint<TName extends string>(name: TName): GelInt53BuilderInitial<TName>;
