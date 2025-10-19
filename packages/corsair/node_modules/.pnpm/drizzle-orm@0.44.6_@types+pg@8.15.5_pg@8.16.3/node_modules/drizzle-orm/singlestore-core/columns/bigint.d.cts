import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.cjs";
export type SingleStoreBigInt53BuilderInitial<TName extends string> = SingleStoreBigInt53Builder<{
    name: TName;
    dataType: 'number';
    columnType: 'SingleStoreBigInt53';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class SingleStoreBigInt53Builder<T extends ColumnBuilderBaseConfig<'number', 'SingleStoreBigInt53'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, {
    unsigned: boolean;
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], unsigned?: boolean);
}
export declare class SingleStoreBigInt53<T extends ColumnBaseConfig<'number', 'SingleStoreBigInt53'>> extends SingleStoreColumnWithAutoIncrement<T, {
    unsigned: boolean;
}> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export type SingleStoreBigInt64BuilderInitial<TName extends string> = SingleStoreBigInt64Builder<{
    name: TName;
    dataType: 'bigint';
    columnType: 'SingleStoreBigInt64';
    data: bigint;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreBigInt64Builder<T extends ColumnBuilderBaseConfig<'bigint', 'SingleStoreBigInt64'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, {
    unsigned: boolean;
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], unsigned?: boolean);
}
export declare class SingleStoreBigInt64<T extends ColumnBaseConfig<'bigint', 'SingleStoreBigInt64'>> extends SingleStoreColumnWithAutoIncrement<T, {
    unsigned: boolean;
}> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string): bigint;
}
export interface SingleStoreBigIntConfig<T extends 'number' | 'bigint' = 'number' | 'bigint'> {
    mode: T;
    unsigned?: boolean;
}
export declare function bigint<TMode extends SingleStoreBigIntConfig['mode']>(config: SingleStoreBigIntConfig<TMode>): TMode extends 'number' ? SingleStoreBigInt53BuilderInitial<''> : SingleStoreBigInt64BuilderInitial<''>;
export declare function bigint<TName extends string, TMode extends SingleStoreBigIntConfig['mode']>(name: TName, config: SingleStoreBigIntConfig<TMode>): TMode extends 'number' ? SingleStoreBigInt53BuilderInitial<TName> : SingleStoreBigInt64BuilderInitial<TName>;
