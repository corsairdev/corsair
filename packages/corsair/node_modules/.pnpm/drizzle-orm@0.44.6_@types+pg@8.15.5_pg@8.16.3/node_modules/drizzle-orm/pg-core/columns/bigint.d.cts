import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { PgColumn } from "./common.cjs";
import { PgIntColumnBaseBuilder } from "./int.common.cjs";
export type PgBigInt53BuilderInitial<TName extends string> = PgBigInt53Builder<{
    name: TName;
    dataType: 'number';
    columnType: 'PgBigInt53';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class PgBigInt53Builder<T extends ColumnBuilderBaseConfig<'number', 'PgBigInt53'>> extends PgIntColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgBigInt53<T extends ColumnBaseConfig<'number', 'PgBigInt53'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export type PgBigInt64BuilderInitial<TName extends string> = PgBigInt64Builder<{
    name: TName;
    dataType: 'bigint';
    columnType: 'PgBigInt64';
    data: bigint;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgBigInt64Builder<T extends ColumnBuilderBaseConfig<'bigint', 'PgBigInt64'>> extends PgIntColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgBigInt64<T extends ColumnBaseConfig<'bigint', 'PgBigInt64'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string): bigint;
}
export interface PgBigIntConfig<T extends 'number' | 'bigint' = 'number' | 'bigint'> {
    mode: T;
}
export declare function bigint<TMode extends PgBigIntConfig['mode']>(config: PgBigIntConfig<TMode>): TMode extends 'number' ? PgBigInt53BuilderInitial<''> : PgBigInt64BuilderInitial<''>;
export declare function bigint<TName extends string, TMode extends PgBigIntConfig['mode']>(name: TName, config: PgBigIntConfig<TMode>): TMode extends 'number' ? PgBigInt53BuilderInitial<TName> : PgBigInt64BuilderInitial<TName>;
