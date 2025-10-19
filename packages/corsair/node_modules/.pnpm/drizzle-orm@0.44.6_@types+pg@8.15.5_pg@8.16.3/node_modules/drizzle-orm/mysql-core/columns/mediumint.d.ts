import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
import type { MySqlIntConfig } from "./int.js";
export type MySqlMediumIntBuilderInitial<TName extends string> = MySqlMediumIntBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlMediumInt';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class MySqlMediumIntBuilder<T extends ColumnBuilderBaseConfig<'number', 'MySqlMediumInt'>> extends MySqlColumnBuilderWithAutoIncrement<T, MySqlIntConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config?: MySqlIntConfig);
}
export declare class MySqlMediumInt<T extends ColumnBaseConfig<'number', 'MySqlMediumInt'>> extends MySqlColumnWithAutoIncrement<T, MySqlIntConfig> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function mediumint(): MySqlMediumIntBuilderInitial<''>;
export declare function mediumint(config?: MySqlIntConfig): MySqlMediumIntBuilderInitial<''>;
export declare function mediumint<TName extends string>(name: TName, config?: MySqlIntConfig): MySqlMediumIntBuilderInitial<TName>;
