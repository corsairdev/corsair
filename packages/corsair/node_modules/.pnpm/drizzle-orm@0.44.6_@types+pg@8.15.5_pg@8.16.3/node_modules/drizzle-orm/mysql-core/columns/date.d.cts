import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { AnyMySqlTable } from "../table.cjs";
import { type Equal } from "../../utils.cjs";
import { MySqlColumn, MySqlColumnBuilder } from "./common.cjs";
export type MySqlDateBuilderInitial<TName extends string> = MySqlDateBuilder<{
    name: TName;
    dataType: 'date';
    columnType: 'MySqlDate';
    data: Date;
    driverParam: string | number;
    enumValues: undefined;
}>;
export declare class MySqlDateBuilder<T extends ColumnBuilderBaseConfig<'date', 'MySqlDate'>> extends MySqlColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class MySqlDate<T extends ColumnBaseConfig<'date', 'MySqlDate'>> extends MySqlColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnyMySqlTable<{
        name: T['tableName'];
    }>, config: MySqlDateBuilder<T>['config']);
    getSQLType(): string;
    mapFromDriverValue(value: string): Date;
}
export type MySqlDateStringBuilderInitial<TName extends string> = MySqlDateStringBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlDateString';
    data: string;
    driverParam: string | number;
    enumValues: undefined;
}>;
export declare class MySqlDateStringBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlDateString'>> extends MySqlColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class MySqlDateString<T extends ColumnBaseConfig<'string', 'MySqlDateString'>> extends MySqlColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnyMySqlTable<{
        name: T['tableName'];
    }>, config: MySqlDateStringBuilder<T>['config']);
    getSQLType(): string;
}
export interface MySqlDateConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
    mode?: TMode;
}
export declare function date(): MySqlDateBuilderInitial<''>;
export declare function date<TMode extends MySqlDateConfig['mode'] & {}>(config?: MySqlDateConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlDateStringBuilderInitial<''> : MySqlDateBuilderInitial<''>;
export declare function date<TName extends string, TMode extends MySqlDateConfig['mode'] & {}>(name: TName, config?: MySqlDateConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlDateStringBuilderInitial<TName> : MySqlDateBuilderInitial<TName>;
