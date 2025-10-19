import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { AnyPgTable } from "../table.cjs";
import type { NonArray, Writable } from "../../utils.cjs";
import { PgColumn, PgColumnBuilder } from "./common.cjs";
export type PgEnumObjectColumnBuilderInitial<TName extends string, TValues extends object> = PgEnumObjectColumnBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgEnumObjectColumn';
    data: TValues[keyof TValues];
    enumValues: string[];
    driverParam: string;
}>;
export interface PgEnumObject<TValues extends object> {
    (): PgEnumObjectColumnBuilderInitial<'', TValues>;
    <TName extends string>(name: TName): PgEnumObjectColumnBuilderInitial<TName, TValues>;
    <TName extends string>(name?: TName): PgEnumObjectColumnBuilderInitial<TName, TValues>;
    readonly enumName: string;
    readonly enumValues: string[];
    readonly schema: string | undefined;
}
export declare class PgEnumObjectColumnBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgEnumObjectColumn'> & {
    enumValues: string[];
}> extends PgColumnBuilder<T, {
    enum: PgEnumObject<any>;
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], enumInstance: PgEnumObject<any>);
}
export declare class PgEnumObjectColumn<T extends ColumnBaseConfig<'string', 'PgEnumObjectColumn'> & {
    enumValues: object;
}> extends PgColumn<T, {
    enum: PgEnumObject<object>;
}> {
    static readonly [entityKind]: string;
    readonly enum: PgEnumObject<any>;
    readonly enumValues: string[];
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgEnumObjectColumnBuilder<T>['config']);
    getSQLType(): string;
}
export type PgEnumColumnBuilderInitial<TName extends string, TValues extends [string, ...string[]]> = PgEnumColumnBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgEnumColumn';
    data: TValues[number];
    enumValues: TValues;
    driverParam: string;
}>;
export interface PgEnum<TValues extends [string, ...string[]]> {
    (): PgEnumColumnBuilderInitial<'', TValues>;
    <TName extends string>(name: TName): PgEnumColumnBuilderInitial<TName, TValues>;
    <TName extends string>(name?: TName): PgEnumColumnBuilderInitial<TName, TValues>;
    readonly enumName: string;
    readonly enumValues: TValues;
    readonly schema: string | undefined;
}
export declare function isPgEnum(obj: unknown): obj is PgEnum<[string, ...string[]]>;
export declare class PgEnumColumnBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgEnumColumn'> & {
    enumValues: [string, ...string[]];
}> extends PgColumnBuilder<T, {
    enum: PgEnum<T['enumValues']>;
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], enumInstance: PgEnum<T['enumValues']>);
}
export declare class PgEnumColumn<T extends ColumnBaseConfig<'string', 'PgEnumColumn'> & {
    enumValues: [string, ...string[]];
}> extends PgColumn<T, {
    enum: PgEnum<T['enumValues']>;
}> {
    static readonly [entityKind]: string;
    readonly enum: PgEnum<T["enumValues"]>;
    readonly enumValues: T["enumValues"];
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgEnumColumnBuilder<T>['config']);
    getSQLType(): string;
}
export declare function pgEnum<U extends string, T extends Readonly<[U, ...U[]]>>(enumName: string, values: T | Writable<T>): PgEnum<Writable<T>>;
export declare function pgEnum<E extends Record<string, string>>(enumName: string, enumObj: NonArray<E>): PgEnumObject<E>;
