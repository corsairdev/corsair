import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { MySqlColumn, MySqlColumnBuilder } from "./common.cjs";
export type MySqlBooleanBuilderInitial<TName extends string> = MySqlBooleanBuilder<{
    name: TName;
    dataType: 'boolean';
    columnType: 'MySqlBoolean';
    data: boolean;
    driverParam: number | boolean;
    enumValues: undefined;
}>;
export declare class MySqlBooleanBuilder<T extends ColumnBuilderBaseConfig<'boolean', 'MySqlBoolean'>> extends MySqlColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class MySqlBoolean<T extends ColumnBaseConfig<'boolean', 'MySqlBoolean'>> extends MySqlColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | boolean): boolean;
}
export declare function boolean(): MySqlBooleanBuilderInitial<''>;
export declare function boolean<TName extends string>(name: TName): MySqlBooleanBuilderInitial<TName>;
