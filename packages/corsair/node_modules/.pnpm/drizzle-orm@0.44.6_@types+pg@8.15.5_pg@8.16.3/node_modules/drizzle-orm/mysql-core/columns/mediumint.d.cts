import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.cjs";
import type { MySqlIntConfig } from "./int.cjs";
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
