import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import type { AnySingleStoreTable } from "../table.js";
import { type Equal } from "../../utils.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
export type SingleStoreDateBuilderInitial<TName extends string> = SingleStoreDateBuilder<{
    name: TName;
    dataType: 'date';
    columnType: 'SingleStoreDate';
    data: Date;
    driverParam: string | number;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreDateBuilder<T extends ColumnBuilderBaseConfig<'date', 'SingleStoreDate'>> extends SingleStoreColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SingleStoreDate<T extends ColumnBaseConfig<'date', 'SingleStoreDate'>> extends SingleStoreColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnySingleStoreTable<{
        name: T['tableName'];
    }>, config: SingleStoreDateBuilder<T>['config']);
    getSQLType(): string;
    mapFromDriverValue(value: string): Date;
}
export type SingleStoreDateStringBuilderInitial<TName extends string> = SingleStoreDateStringBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreDateString';
    data: string;
    driverParam: string | number;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreDateStringBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreDateString'>> extends SingleStoreColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SingleStoreDateString<T extends ColumnBaseConfig<'string', 'SingleStoreDateString'>> extends SingleStoreColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnySingleStoreTable<{
        name: T['tableName'];
    }>, config: SingleStoreDateStringBuilder<T>['config']);
    getSQLType(): string;
}
export interface SingleStoreDateConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
    mode?: TMode;
}
export declare function date(): SingleStoreDateBuilderInitial<''>;
export declare function date<TMode extends SingleStoreDateConfig['mode'] & {}>(config?: SingleStoreDateConfig<TMode>): Equal<TMode, 'string'> extends true ? SingleStoreDateStringBuilderInitial<''> : SingleStoreDateBuilderInitial<''>;
export declare function date<TName extends string, TMode extends SingleStoreDateConfig['mode'] & {}>(name: TName, config?: SingleStoreDateConfig<TMode>): Equal<TMode, 'string'> extends true ? SingleStoreDateStringBuilderInitial<TName> : SingleStoreDateBuilderInitial<TName>;
