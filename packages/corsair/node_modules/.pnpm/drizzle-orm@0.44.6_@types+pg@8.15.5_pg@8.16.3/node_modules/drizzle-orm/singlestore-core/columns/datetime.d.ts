import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import type { AnySingleStoreTable } from "../table.js";
import { type Equal } from "../../utils.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
export type SingleStoreDateTimeBuilderInitial<TName extends string> = SingleStoreDateTimeBuilder<{
    name: TName;
    dataType: 'date';
    columnType: 'SingleStoreDateTime';
    data: Date;
    driverParam: string | number;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreDateTimeBuilder<T extends ColumnBuilderBaseConfig<'date', 'SingleStoreDateTime'>> extends SingleStoreColumnBuilder<T, SingleStoreDatetimeConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SingleStoreDateTime<T extends ColumnBaseConfig<'date', 'SingleStoreDateTime'>> extends SingleStoreColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnySingleStoreTable<{
        name: T['tableName'];
    }>, config: SingleStoreDateTimeBuilder<T>['config']);
    getSQLType(): string;
    mapToDriverValue(value: Date): unknown;
    mapFromDriverValue(value: string): Date;
}
export type SingleStoreDateTimeStringBuilderInitial<TName extends string> = SingleStoreDateTimeStringBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreDateTimeString';
    data: string;
    driverParam: string | number;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreDateTimeStringBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreDateTimeString'>> extends SingleStoreColumnBuilder<T, SingleStoreDatetimeConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SingleStoreDateTimeString<T extends ColumnBaseConfig<'string', 'SingleStoreDateTimeString'>> extends SingleStoreColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnySingleStoreTable<{
        name: T['tableName'];
    }>, config: SingleStoreDateTimeStringBuilder<T>['config']);
    getSQLType(): string;
}
export interface SingleStoreDatetimeConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
    mode?: TMode;
}
export declare function datetime(): SingleStoreDateTimeBuilderInitial<''>;
export declare function datetime<TMode extends SingleStoreDatetimeConfig['mode'] & {}>(config?: SingleStoreDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? SingleStoreDateTimeStringBuilderInitial<''> : SingleStoreDateTimeBuilderInitial<''>;
export declare function datetime<TName extends string, TMode extends SingleStoreDatetimeConfig['mode'] & {}>(name: TName, config?: SingleStoreDatetimeConfig<TMode>): Equal<TMode, 'string'> extends true ? SingleStoreDateTimeStringBuilderInitial<TName> : SingleStoreDateTimeBuilderInitial<TName>;
