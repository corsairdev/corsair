import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
export type MySqlIntBuilderInitial<TName extends string> = MySqlIntBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlInt';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class MySqlIntBuilder<T extends ColumnBuilderBaseConfig<'number', 'MySqlInt'>> extends MySqlColumnBuilderWithAutoIncrement<T, MySqlIntConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config?: MySqlIntConfig);
}
export declare class MySqlInt<T extends ColumnBaseConfig<'number', 'MySqlInt'>> extends MySqlColumnWithAutoIncrement<T, MySqlIntConfig> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export interface MySqlIntConfig {
    unsigned?: boolean;
}
export declare function int(): MySqlIntBuilderInitial<''>;
export declare function int(config?: MySqlIntConfig): MySqlIntBuilderInitial<''>;
export declare function int<TName extends string>(name: TName, config?: MySqlIntConfig): MySqlIntBuilderInitial<TName>;
