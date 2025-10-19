import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { GelColumn, GelColumnBuilder } from "./common.cjs";
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
