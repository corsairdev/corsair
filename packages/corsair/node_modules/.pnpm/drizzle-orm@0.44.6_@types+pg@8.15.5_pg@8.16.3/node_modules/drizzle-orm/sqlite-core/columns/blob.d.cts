import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { type Equal } from "../../utils.cjs";
import { SQLiteColumn, SQLiteColumnBuilder } from "./common.cjs";
type BlobMode = 'buffer' | 'json' | 'bigint';
export type SQLiteBigIntBuilderInitial<TName extends string> = SQLiteBigIntBuilder<{
    name: TName;
    dataType: 'bigint';
    columnType: 'SQLiteBigInt';
    data: bigint;
    driverParam: Buffer;
    enumValues: undefined;
}>;
export declare class SQLiteBigIntBuilder<T extends ColumnBuilderBaseConfig<'bigint', 'SQLiteBigInt'>> extends SQLiteColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SQLiteBigInt<T extends ColumnBaseConfig<'bigint', 'SQLiteBigInt'>> extends SQLiteColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: Buffer | Uint8Array | ArrayBuffer): bigint;
    mapToDriverValue(value: bigint): Buffer;
}
export type SQLiteBlobJsonBuilderInitial<TName extends string> = SQLiteBlobJsonBuilder<{
    name: TName;
    dataType: 'json';
    columnType: 'SQLiteBlobJson';
    data: unknown;
    driverParam: Buffer;
    enumValues: undefined;
}>;
export declare class SQLiteBlobJsonBuilder<T extends ColumnBuilderBaseConfig<'json', 'SQLiteBlobJson'>> extends SQLiteColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SQLiteBlobJson<T extends ColumnBaseConfig<'json', 'SQLiteBlobJson'>> extends SQLiteColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: Buffer | Uint8Array | ArrayBuffer): T['data'];
    mapToDriverValue(value: T['data']): Buffer;
}
export type SQLiteBlobBufferBuilderInitial<TName extends string> = SQLiteBlobBufferBuilder<{
    name: TName;
    dataType: 'buffer';
    columnType: 'SQLiteBlobBuffer';
    data: Buffer;
    driverParam: Buffer;
    enumValues: undefined;
}>;
export declare class SQLiteBlobBufferBuilder<T extends ColumnBuilderBaseConfig<'buffer', 'SQLiteBlobBuffer'>> extends SQLiteColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SQLiteBlobBuffer<T extends ColumnBaseConfig<'buffer', 'SQLiteBlobBuffer'>> extends SQLiteColumn<T> {
    static readonly [entityKind]: string;
    mapFromDriverValue(value: Buffer | Uint8Array | ArrayBuffer): T['data'];
    getSQLType(): string;
}
export interface BlobConfig<TMode extends BlobMode = BlobMode> {
    mode: TMode;
}
/**
 *  It's recommended to use `text('...', { mode: 'json' })` instead of `blob` in JSON mode, because it supports JSON functions:
 * >All JSON functions currently throw an error if any of their arguments are BLOBs because BLOBs are reserved for a future enhancement in which BLOBs will store the binary encoding for JSON.
 *
 * https://www.sqlite.org/json1.html
 */
export declare function blob(): SQLiteBlobJsonBuilderInitial<''>;
export declare function blob<TMode extends BlobMode = BlobMode>(config?: BlobConfig<TMode>): Equal<TMode, 'bigint'> extends true ? SQLiteBigIntBuilderInitial<''> : Equal<TMode, 'buffer'> extends true ? SQLiteBlobBufferBuilderInitial<''> : SQLiteBlobJsonBuilderInitial<''>;
export declare function blob<TName extends string, TMode extends BlobMode = BlobMode>(name: TName, config?: BlobConfig<TMode>): Equal<TMode, 'bigint'> extends true ? SQLiteBigIntBuilderInitial<TName> : Equal<TMode, 'buffer'> extends true ? SQLiteBlobBufferBuilderInitial<TName> : SQLiteBlobJsonBuilderInitial<TName>;
export {};
