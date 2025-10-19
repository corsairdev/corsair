import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { AnyPgTable } from "../table.cjs";
import { type Equal } from "../../utils.cjs";
import { PgColumn, PgColumnBuilder } from "./common.cjs";
export type PgNumericBuilderInitial<TName extends string> = PgNumericBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgNumeric';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgNumericBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgNumeric'>> extends PgColumnBuilder<T, {
    precision: number | undefined;
    scale: number | undefined;
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], precision?: number, scale?: number);
}
export declare class PgNumeric<T extends ColumnBaseConfig<'string', 'PgNumeric'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgNumericBuilder<T>['config']);
    mapFromDriverValue(value: unknown): string;
    getSQLType(): string;
}
export type PgNumericNumberBuilderInitial<TName extends string> = PgNumericNumberBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'PgNumericNumber';
    data: number;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgNumericNumberBuilder<T extends ColumnBuilderBaseConfig<'number', 'PgNumericNumber'>> extends PgColumnBuilder<T, {
    precision: number | undefined;
    scale: number | undefined;
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], precision?: number, scale?: number);
}
export declare class PgNumericNumber<T extends ColumnBaseConfig<'number', 'PgNumericNumber'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgNumericNumberBuilder<T>['config']);
    mapFromDriverValue(value: unknown): number;
    mapToDriverValue: StringConstructor;
    getSQLType(): string;
}
export type PgNumericBigIntBuilderInitial<TName extends string> = PgNumericBigIntBuilder<{
    name: TName;
    dataType: 'bigint';
    columnType: 'PgNumericBigInt';
    data: bigint;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgNumericBigIntBuilder<T extends ColumnBuilderBaseConfig<'bigint', 'PgNumericBigInt'>> extends PgColumnBuilder<T, {
    precision: number | undefined;
    scale: number | undefined;
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], precision?: number, scale?: number);
}
export declare class PgNumericBigInt<T extends ColumnBaseConfig<'bigint', 'PgNumericBigInt'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgNumericBigIntBuilder<T>['config']);
    mapFromDriverValue: BigIntConstructor;
    mapToDriverValue: StringConstructor;
    getSQLType(): string;
}
export type PgNumericConfig<T extends 'string' | 'number' | 'bigint' = 'string' | 'number' | 'bigint'> = {
    precision: number;
    scale?: number;
    mode?: T;
} | {
    precision?: number;
    scale: number;
    mode?: T;
} | {
    precision?: number;
    scale?: number;
    mode: T;
};
export declare function numeric<TMode extends 'string' | 'number' | 'bigint'>(config?: PgNumericConfig<TMode>): Equal<TMode, 'number'> extends true ? PgNumericNumberBuilderInitial<''> : Equal<TMode, 'bigint'> extends true ? PgNumericBigIntBuilderInitial<''> : PgNumericBuilderInitial<''>;
export declare function numeric<TName extends string, TMode extends 'string' | 'number' | 'bigint'>(name: TName, config?: PgNumericConfig<TMode>): Equal<TMode, 'number'> extends true ? PgNumericNumberBuilderInitial<TName> : Equal<TMode, 'bigint'> extends true ? PgNumericBigIntBuilderInitial<TName> : PgNumericBuilderInitial<TName>;
export declare const decimal: typeof numeric;
