import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
import type { MySqlIntConfig } from "./int.js";
export type MySqlTinyIntBuilderInitial<TName extends string> = MySqlTinyIntBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlTinyInt';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class MySqlTinyIntBuilder<T extends ColumnBuilderBaseConfig<'number', 'MySqlTinyInt'>> extends MySqlColumnBuilderWithAutoIncrement<T, MySqlIntConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config?: MySqlIntConfig);
}
export declare class MySqlTinyInt<T extends ColumnBaseConfig<'number', 'MySqlTinyInt'>> extends MySqlColumnWithAutoIncrement<T, MySqlIntConfig> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function tinyint(): MySqlTinyIntBuilderInitial<''>;
export declare function tinyint(config?: MySqlIntConfig): MySqlTinyIntBuilderInitial<''>;
export declare function tinyint<TName extends string>(name: TName, config?: MySqlIntConfig): MySqlTinyIntBuilderInitial<TName>;
