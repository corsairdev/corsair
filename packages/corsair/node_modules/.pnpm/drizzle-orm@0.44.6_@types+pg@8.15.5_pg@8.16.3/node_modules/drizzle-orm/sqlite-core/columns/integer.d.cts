import type { ColumnBuilderBaseConfig, ColumnDataType, HasDefault, IsPrimaryKey, MakeColumnConfig, NotNull } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { OnConflict } from "../utils.cjs";
import { type Equal, type Or } from "../../utils.cjs";
import type { AnySQLiteTable } from "../table.cjs";
import { SQLiteColumn, SQLiteColumnBuilder } from "./common.cjs";
export interface PrimaryKeyConfig {
    autoIncrement?: boolean;
    onConflict?: OnConflict;
}
export declare abstract class SQLiteBaseIntegerBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends SQLiteColumnBuilder<T, TRuntimeConfig & {
    autoIncrement: boolean;
}, {}, {
    primaryKeyHasDefault: true;
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], dataType: T['dataType'], columnType: T['columnType']);
    primaryKey(config?: PrimaryKeyConfig): IsPrimaryKey<HasDefault<NotNull<this>>>;
}
export declare abstract class SQLiteBaseInteger<T extends ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends SQLiteColumn<T, TRuntimeConfig & {
    autoIncrement: boolean;
}> {
    static readonly [entityKind]: string;
    readonly autoIncrement: boolean;
    getSQLType(): string;
}
export type SQLiteIntegerBuilderInitial<TName extends string> = SQLiteIntegerBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SQLiteInteger';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>;
export declare class SQLiteIntegerBuilder<T extends ColumnBuilderBaseConfig<'number', 'SQLiteInteger'>> extends SQLiteBaseIntegerBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
    build<TTableName extends string>(table: AnySQLiteTable<{
        name: TTableName;
    }>): SQLiteInteger<MakeColumnConfig<T, TTableName>>;
}
export declare class SQLiteInteger<T extends ColumnBaseConfig<'number', 'SQLiteInteger'>> extends SQLiteBaseInteger<T> {
    static readonly [entityKind]: string;
}
export type SQLiteTimestampBuilderInitial<TName extends string> = SQLiteTimestampBuilder<{
    name: TName;
    dataType: 'date';
    columnType: 'SQLiteTimestamp';
    data: Date;
    driverParam: number;
    enumValues: undefined;
}>;
export declare class SQLiteTimestampBuilder<T extends ColumnBuilderBaseConfig<'date', 'SQLiteTimestamp'>> extends SQLiteBaseIntegerBuilder<T, {
    mode: 'timestamp' | 'timestamp_ms';
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], mode: 'timestamp' | 'timestamp_ms');
    /**
     * @deprecated Use `default()` with your own expression instead.
     *
     * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
     */
    defaultNow(): HasDefault<this>;
    build<TTableName extends string>(table: AnySQLiteTable<{
        name: TTableName;
    }>): SQLiteTimestamp<MakeColumnConfig<T, TTableName>>;
}
export declare class SQLiteTimestamp<T extends ColumnBaseConfig<'date', 'SQLiteTimestamp'>> extends SQLiteBaseInteger<T, {
    mode: 'timestamp' | 'timestamp_ms';
}> {
    static readonly [entityKind]: string;
    readonly mode: 'timestamp' | 'timestamp_ms';
    mapFromDriverValue(value: number): Date;
    mapToDriverValue(value: Date): number;
}
export type SQLiteBooleanBuilderInitial<TName extends string> = SQLiteBooleanBuilder<{
    name: TName;
    dataType: 'boolean';
    columnType: 'SQLiteBoolean';
    data: boolean;
    driverParam: number;
    enumValues: undefined;
}>;
export declare class SQLiteBooleanBuilder<T extends ColumnBuilderBaseConfig<'boolean', 'SQLiteBoolean'>> extends SQLiteBaseIntegerBuilder<T, {
    mode: 'boolean';
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], mode: 'boolean');
    build<TTableName extends string>(table: AnySQLiteTable<{
        name: TTableName;
    }>): SQLiteBoolean<MakeColumnConfig<T, TTableName>>;
}
export declare class SQLiteBoolean<T extends ColumnBaseConfig<'boolean', 'SQLiteBoolean'>> extends SQLiteBaseInteger<T, {
    mode: 'boolean';
}> {
    static readonly [entityKind]: string;
    readonly mode: 'boolean';
    mapFromDriverValue(value: number): boolean;
    mapToDriverValue(value: boolean): number;
}
export interface IntegerConfig<TMode extends 'number' | 'timestamp' | 'timestamp_ms' | 'boolean' = 'number' | 'timestamp' | 'timestamp_ms' | 'boolean'> {
    mode: TMode;
}
export declare function integer(): SQLiteIntegerBuilderInitial<''>;
export declare function integer<TMode extends IntegerConfig['mode']>(config?: IntegerConfig<TMode>): Or<Equal<TMode, 'timestamp'>, Equal<TMode, 'timestamp_ms'>> extends true ? SQLiteTimestampBuilderInitial<''> : Equal<TMode, 'boolean'> extends true ? SQLiteBooleanBuilderInitial<''> : SQLiteIntegerBuilderInitial<''>;
export declare function integer<TName extends string, TMode extends IntegerConfig['mode']>(name: TName, config?: IntegerConfig<TMode>): Or<Equal<TMode, 'timestamp'>, Equal<TMode, 'timestamp_ms'>> extends true ? SQLiteTimestampBuilderInitial<TName> : Equal<TMode, 'boolean'> extends true ? SQLiteBooleanBuilderInitial<TName> : SQLiteIntegerBuilderInitial<TName>;
export declare const int: typeof integer;
