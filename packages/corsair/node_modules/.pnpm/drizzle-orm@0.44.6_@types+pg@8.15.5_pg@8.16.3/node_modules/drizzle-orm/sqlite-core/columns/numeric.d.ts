import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { type Equal } from "../../utils.js";
import { SQLiteColumn, SQLiteColumnBuilder } from "./common.js";
export type SQLiteNumericBuilderInitial<TName extends string> = SQLiteNumericBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SQLiteNumeric';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class SQLiteNumericBuilder<T extends ColumnBuilderBaseConfig<'string', 'SQLiteNumeric'>> extends SQLiteColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SQLiteNumeric<T extends ColumnBaseConfig<'string', 'SQLiteNumeric'>> extends SQLiteColumn<T> {
    static readonly [entityKind]: string;
    mapFromDriverValue(value: unknown): string;
    getSQLType(): string;
}
export type SQLiteNumericNumberBuilderInitial<TName extends string> = SQLiteNumericNumberBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SQLiteNumericNumber';
    data: number;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class SQLiteNumericNumberBuilder<T extends ColumnBuilderBaseConfig<'number', 'SQLiteNumericNumber'>> extends SQLiteColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SQLiteNumericNumber<T extends ColumnBaseConfig<'number', 'SQLiteNumericNumber'>> extends SQLiteColumn<T> {
    static readonly [entityKind]: string;
    mapFromDriverValue(value: unknown): number;
    mapToDriverValue: StringConstructor;
    getSQLType(): string;
}
export type SQLiteNumericBigIntBuilderInitial<TName extends string> = SQLiteNumericBigIntBuilder<{
    name: TName;
    dataType: 'bigint';
    columnType: 'SQLiteNumericBigInt';
    data: bigint;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class SQLiteNumericBigIntBuilder<T extends ColumnBuilderBaseConfig<'bigint', 'SQLiteNumericBigInt'>> extends SQLiteColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SQLiteNumericBigInt<T extends ColumnBaseConfig<'bigint', 'SQLiteNumericBigInt'>> extends SQLiteColumn<T> {
    static readonly [entityKind]: string;
    mapFromDriverValue: BigIntConstructor;
    mapToDriverValue: StringConstructor;
    getSQLType(): string;
}
export type SQLiteNumericConfig<T extends 'string' | 'number' | 'bigint' = 'string' | 'number' | 'bigint'> = {
    mode: T;
};
export declare function numeric<TMode extends SQLiteNumericConfig['mode']>(config?: SQLiteNumericConfig<TMode>): Equal<TMode, 'number'> extends true ? SQLiteNumericNumberBuilderInitial<''> : Equal<TMode, 'bigint'> extends true ? SQLiteNumericBigIntBuilderInitial<''> : SQLiteNumericBuilderInitial<''>;
export declare function numeric<TName extends string, TMode extends SQLiteNumericConfig['mode']>(name: TName, config?: SQLiteNumericConfig<TMode>): Equal<TMode, 'number'> extends true ? SQLiteNumericNumberBuilderInitial<TName> : Equal<TMode, 'bigint'> extends true ? SQLiteNumericBigIntBuilderInitial<TName> : SQLiteNumericBuilderInitial<TName>;
