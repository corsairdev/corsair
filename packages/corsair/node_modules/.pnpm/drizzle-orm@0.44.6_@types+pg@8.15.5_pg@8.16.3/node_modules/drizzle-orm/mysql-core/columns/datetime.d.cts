import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { AnyMySqlTable } from "../table.cjs";
import { type Equal } from "../../utils.cjs";
import { MySqlColumn, MySqlColumnBuilder } from "./common.cjs";
export type MySqlDateTimeBuilderInitial<TName extends string> = MySqlDateTimeBuilder<{
    name: TName;
    dataType: 'date';
    columnType: 'MySqlDateTime';
    data: Date;
    driverParam: string | number;
    enumValues: undefined;
}>;
export declare class MySqlDateTimeBuilder<T extends ColumnBuilderBaseConfig<'date', 'MySqlDateTime'>> extends MySqlColumnBuilder<T, MySqlDatetimeConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: MySqlDatetimeConfig | undefined);
}
export declare class MySqlDateTime<T extends ColumnBaseConfig<'date', 'MySqlDateTime'>> extends MySqlColumn<T> {
    static readonly [entityKind]: string;
    readonly fsp: number | undefined;
    constructor(table: AnyMySqlTable<{
        name: T['tableName'];
    }>, config: MySqlDateTimeBuilder<T>['config']);
    getSQLType(): string;
    mapToDriverValue(value: Date): unknown;
    mapFromDriverValue(value: string): Date;
}
export type MySqlDateTimeStringBuilderInitial<TName extends string> = MySqlDateTimeStringBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlDateTimeString';
    data: string;
    driverParam: string | number;
    enumValues: undefined;
}>;
export declare class MySqlDateTimeStringBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlDateTimeString'>> extends MySqlColumnBuilder<T, MySqlDatetimeConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: MySqlDatetimeConfig | undefined);
}
export declare class MySqlDateTimeString<T extends ColumnBaseConfig<'string', 'MySqlDateTimeString'>> extends MySqlColumn<T> {
    static readonly [entityKind]: string;
    readonly fsp: number | undefined;
    constructor(table: AnyMySqlTable<{
        name: T['tableName'];
    }>, config: MySqlDateTimeStringBuilder<T>['config']);
    getSQLType(): string;
}
export type DatetimeFsp = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface MySqlDatetimeConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
    mode?: TMode;
    fsp?: DatetimeFsp;
}
export declare function datetime(): MySqlDateTimeBuilderInitial<''>;
export declare function datetime<TMode extends MySqlDatetimeConfig['mode'] & {}>(config?: MySqlDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlDateTimeStringBuilderInitial<''> : MySqlDateTimeBuilderInitial<''>;
export declare function datetime<TName extends string, TMode extends MySqlDatetimeConfig['mode'] & {}>(name: TName, config?: MySqlDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlDateTimeStringBuilderInitial<TName> : MySqlDateTimeBuilderInitial<TName>;
