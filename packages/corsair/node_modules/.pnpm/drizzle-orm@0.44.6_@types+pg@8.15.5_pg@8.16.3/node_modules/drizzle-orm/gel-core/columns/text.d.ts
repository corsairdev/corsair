import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
type GelTextBuilderInitial<TName extends string> = GelTextBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'GelText';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class GelTextBuilder<T extends ColumnBuilderBaseConfig<'string', 'GelText'>> extends GelColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelText<T extends ColumnBaseConfig<'string', 'GelText'>> extends GelColumn<T, {
    enumValues: T['enumValues'];
}> {
    static readonly [entityKind]: string;
    readonly enumValues: T["enumValues"];
    getSQLType(): string;
}
export declare function text(): GelTextBuilderInitial<''>;
export declare function text<TName extends string>(name: TName): GelTextBuilderInitial<TName>;
export {};
