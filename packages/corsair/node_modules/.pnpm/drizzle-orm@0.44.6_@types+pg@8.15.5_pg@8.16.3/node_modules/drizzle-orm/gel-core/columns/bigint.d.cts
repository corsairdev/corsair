import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { GelColumn } from "./common.cjs";
import { GelIntColumnBaseBuilder } from "./int.common.cjs";
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
