import type { ColumnBuilderBaseConfig, HasDefault, NotNull } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
export type PgBigSerial53BuilderInitial<TName extends string> = NotNull<HasDefault<PgBigSerial53Builder<{
    name: TName;
    dataType: 'number';
    columnType: 'PgBigSerial53';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>>>;
export declare class PgBigSerial53Builder<T extends ColumnBuilderBaseConfig<'number', 'PgBigSerial53'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: string);
}
export declare class PgBigSerial53<T extends ColumnBaseConfig<'number', 'PgBigSerial53'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number): number;
}
export type PgBigSerial64BuilderInitial<TName extends string> = NotNull<HasDefault<PgBigSerial64Builder<{
    name: TName;
    dataType: 'bigint';
    columnType: 'PgBigSerial64';
    data: bigint;
    driverParam: string;
    enumValues: undefined;
}>>>;
export declare class PgBigSerial64Builder<T extends ColumnBuilderBaseConfig<'bigint', 'PgBigSerial64'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: string);
}
export declare class PgBigSerial64<T extends ColumnBaseConfig<'bigint', 'PgBigSerial64'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string): bigint;
}
export interface PgBigSerialConfig<T extends 'number' | 'bigint' = 'number' | 'bigint'> {
    mode: T;
}
export declare function bigserial<TMode extends PgBigSerialConfig['mode']>(config: PgBigSerialConfig<TMode>): TMode extends 'number' ? PgBigSerial53BuilderInitial<''> : PgBigSerial64BuilderInitial<''>;
export declare function bigserial<TName extends string, TMode extends PgBigSerialConfig['mode']>(name: TName, config: PgBigSerialConfig<TMode>): TMode extends 'number' ? PgBigSerial53BuilderInitial<TName> : PgBigSerial64BuilderInitial<TName>;
