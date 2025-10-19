import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { type Writable } from "../../utils.cjs";
import { MySqlColumn, MySqlColumnBuilder } from "./common.cjs";
export type MySqlTextColumnType = 'tinytext' | 'text' | 'mediumtext' | 'longtext';
export type MySqlTextBuilderInitial<TName extends string, TEnum extends [string, ...string[]]> = MySqlTextBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlText';
    data: TEnum[number];
    driverParam: string;
    enumValues: TEnum;
}>;
export declare class MySqlTextBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlText'>> extends MySqlColumnBuilder<T, {
    textType: MySqlTextColumnType;
    enumValues: T['enumValues'];
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], textType: MySqlTextColumnType, config: MySqlTextConfig<T['enumValues']>);
}
export declare class MySqlText<T extends ColumnBaseConfig<'string', 'MySqlText'>> extends MySqlColumn<T, {
    textType: MySqlTextColumnType;
    enumValues: T['enumValues'];
}> {
    static readonly [entityKind]: string;
    readonly textType: MySqlTextColumnType;
    readonly enumValues: T["enumValues"];
    getSQLType(): string;
}
export interface MySqlTextConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
    enum?: TEnum;
}
export declare function text(): MySqlTextBuilderInitial<'', [string, ...string[]]>;
export declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilderInitial<'', Writable<T>>;
export declare function text<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>>(name: TName, config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilderInitial<TName, Writable<T>>;
export declare function tinytext(): MySqlTextBuilderInitial<'', [string, ...string[]]>;
export declare function tinytext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilderInitial<'', Writable<T>>;
export declare function tinytext<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>>(name: TName, config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilderInitial<TName, Writable<T>>;
export declare function mediumtext(): MySqlTextBuilderInitial<'', [string, ...string[]]>;
export declare function mediumtext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilderInitial<'', Writable<T>>;
export declare function mediumtext<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>>(name: TName, config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilderInitial<TName, Writable<T>>;
export declare function longtext(): MySqlTextBuilderInitial<'', [string, ...string[]]>;
export declare function longtext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilderInitial<'', Writable<T>>;
export declare function longtext<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>>(name: TName, config?: MySqlTextConfig<T | Writable<T>>): MySqlTextBuilderInitial<TName, Writable<T>>;
