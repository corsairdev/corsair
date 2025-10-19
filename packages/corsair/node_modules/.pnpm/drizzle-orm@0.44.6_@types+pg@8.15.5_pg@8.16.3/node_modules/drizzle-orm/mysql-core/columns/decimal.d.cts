import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { type Equal } from "../../utils.cjs";
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.cjs";
export type MySqlDecimalBuilderInitial<TName extends string> = MySqlDecimalBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlDecimal';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class MySqlDecimalBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlDecimal'>> extends MySqlColumnBuilderWithAutoIncrement<T, MySqlDecimalConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: MySqlDecimalConfig | undefined);
}
export declare class MySqlDecimal<T extends ColumnBaseConfig<'string', 'MySqlDecimal'>> extends MySqlColumnWithAutoIncrement<T, MySqlDecimalConfig> {
    static readonly [entityKind]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    readonly unsigned: boolean | undefined;
    mapFromDriverValue(value: unknown): string;
    getSQLType(): string;
}
export type MySqlDecimalNumberBuilderInitial<TName extends string> = MySqlDecimalNumberBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlDecimalNumber';
    data: number;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class MySqlDecimalNumberBuilder<T extends ColumnBuilderBaseConfig<'number', 'MySqlDecimalNumber'>> extends MySqlColumnBuilderWithAutoIncrement<T, MySqlDecimalConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: MySqlDecimalConfig | undefined);
}
export declare class MySqlDecimalNumber<T extends ColumnBaseConfig<'number', 'MySqlDecimalNumber'>> extends MySqlColumnWithAutoIncrement<T, MySqlDecimalConfig> {
    static readonly [entityKind]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    readonly unsigned: boolean | undefined;
    mapFromDriverValue(value: unknown): number;
    mapToDriverValue: StringConstructor;
    getSQLType(): string;
}
export type MySqlDecimalBigIntBuilderInitial<TName extends string> = MySqlDecimalBigIntBuilder<{
    name: TName;
    dataType: 'bigint';
    columnType: 'MySqlDecimalBigInt';
    data: bigint;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class MySqlDecimalBigIntBuilder<T extends ColumnBuilderBaseConfig<'bigint', 'MySqlDecimalBigInt'>> extends MySqlColumnBuilderWithAutoIncrement<T, MySqlDecimalConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: MySqlDecimalConfig | undefined);
}
export declare class MySqlDecimalBigInt<T extends ColumnBaseConfig<'bigint', 'MySqlDecimalBigInt'>> extends MySqlColumnWithAutoIncrement<T, MySqlDecimalConfig> {
    static readonly [entityKind]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    readonly unsigned: boolean | undefined;
    mapFromDriverValue: BigIntConstructor;
    mapToDriverValue: StringConstructor;
    getSQLType(): string;
}
export interface MySqlDecimalConfig<T extends 'string' | 'number' | 'bigint' = 'string' | 'number' | 'bigint'> {
    precision?: number;
    scale?: number;
    unsigned?: boolean;
    mode?: T;
}
export declare function decimal(): MySqlDecimalBuilderInitial<''>;
export declare function decimal<TMode extends 'string' | 'number' | 'bigint'>(config: MySqlDecimalConfig<TMode>): Equal<TMode, 'number'> extends true ? MySqlDecimalNumberBuilderInitial<''> : Equal<TMode, 'bigint'> extends true ? MySqlDecimalBigIntBuilderInitial<''> : MySqlDecimalBuilderInitial<''>;
export declare function decimal<TName extends string, TMode extends 'string' | 'number' | 'bigint'>(name: TName, config?: MySqlDecimalConfig<TMode>): Equal<TMode, 'number'> extends true ? MySqlDecimalNumberBuilderInitial<TName> : Equal<TMode, 'bigint'> extends true ? MySqlDecimalBigIntBuilderInitial<TName> : MySqlDecimalBuilderInitial<TName>;
