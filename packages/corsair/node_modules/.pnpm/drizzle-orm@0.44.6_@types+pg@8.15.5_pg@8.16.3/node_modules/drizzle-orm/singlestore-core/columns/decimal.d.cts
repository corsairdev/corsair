import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { type Equal } from "../../utils.cjs";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.cjs";
export type SingleStoreDecimalBuilderInitial<TName extends string> = SingleStoreDecimalBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreDecimal';
    data: string;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreDecimalBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreDecimal'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, SingleStoreDecimalConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: SingleStoreDecimalConfig | undefined);
}
export declare class SingleStoreDecimal<T extends ColumnBaseConfig<'string', 'SingleStoreDecimal'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreDecimalConfig> {
    static readonly [entityKind]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    readonly unsigned: boolean | undefined;
    mapFromDriverValue(value: unknown): string;
    getSQLType(): string;
}
export type SingleStoreDecimalNumberBuilderInitial<TName extends string> = SingleStoreDecimalNumberBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SingleStoreDecimalNumber';
    data: number;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreDecimalNumberBuilder<T extends ColumnBuilderBaseConfig<'number', 'SingleStoreDecimalNumber'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, SingleStoreDecimalConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: SingleStoreDecimalConfig | undefined);
}
export declare class SingleStoreDecimalNumber<T extends ColumnBaseConfig<'number', 'SingleStoreDecimalNumber'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreDecimalConfig> {
    static readonly [entityKind]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    readonly unsigned: boolean | undefined;
    mapFromDriverValue(value: unknown): number;
    mapToDriverValue: StringConstructor;
    getSQLType(): string;
}
export type SingleStoreDecimalBigIntBuilderInitial<TName extends string> = SingleStoreDecimalBigIntBuilder<{
    name: TName;
    dataType: 'bigint';
    columnType: 'SingleStoreDecimalBigInt';
    data: bigint;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreDecimalBigIntBuilder<T extends ColumnBuilderBaseConfig<'bigint', 'SingleStoreDecimalBigInt'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, SingleStoreDecimalConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: SingleStoreDecimalConfig | undefined);
}
export declare class SingleStoreDecimalBigInt<T extends ColumnBaseConfig<'bigint', 'SingleStoreDecimalBigInt'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreDecimalConfig> {
    static readonly [entityKind]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    readonly unsigned: boolean | undefined;
    mapFromDriverValue: BigIntConstructor;
    mapToDriverValue: StringConstructor;
    getSQLType(): string;
}
export interface SingleStoreDecimalConfig<T extends 'string' | 'number' | 'bigint' = 'string' | 'number' | 'bigint'> {
    precision?: number;
    scale?: number;
    unsigned?: boolean;
    mode?: T;
}
export declare function decimal(): SingleStoreDecimalBuilderInitial<''>;
export declare function decimal<TMode extends 'string' | 'number' | 'bigint'>(config: SingleStoreDecimalConfig<TMode>): Equal<TMode, 'number'> extends true ? SingleStoreDecimalNumberBuilderInitial<''> : Equal<TMode, 'bigint'> extends true ? SingleStoreDecimalBigIntBuilderInitial<''> : SingleStoreDecimalBuilderInitial<''>;
export declare function decimal<TName extends string, TMode extends 'string' | 'number' | 'bigint'>(name: TName, config?: SingleStoreDecimalConfig<TMode>): Equal<TMode, 'number'> extends true ? SingleStoreDecimalNumberBuilderInitial<TName> : Equal<TMode, 'bigint'> extends true ? SingleStoreDecimalBigIntBuilderInitial<TName> : SingleStoreDecimalBuilderInitial<TName>;
