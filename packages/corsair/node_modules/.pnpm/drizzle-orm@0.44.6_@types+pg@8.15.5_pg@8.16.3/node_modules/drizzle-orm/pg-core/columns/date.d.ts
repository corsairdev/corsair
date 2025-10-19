import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { type Equal } from "../../utils.js";
import { PgColumn } from "./common.js";
import { PgDateColumnBaseBuilder } from "./date.common.js";
export type PgDateBuilderInitial<TName extends string> = PgDateBuilder<{
    name: TName;
    dataType: 'date';
    columnType: 'PgDate';
    data: Date;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgDateBuilder<T extends ColumnBuilderBaseConfig<'date', 'PgDate'>> extends PgDateColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgDate<T extends ColumnBaseConfig<'date', 'PgDate'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string): Date;
    mapToDriverValue(value: Date): string;
}
export type PgDateStringBuilderInitial<TName extends string> = PgDateStringBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgDateString';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgDateStringBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgDateString'>> extends PgDateColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgDateString<T extends ColumnBaseConfig<'string', 'PgDateString'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export interface PgDateConfig<T extends 'date' | 'string' = 'date' | 'string'> {
    mode: T;
}
export declare function date(): PgDateStringBuilderInitial<''>;
export declare function date<TMode extends PgDateConfig['mode'] & {}>(config?: PgDateConfig<TMode>): Equal<TMode, 'date'> extends true ? PgDateBuilderInitial<''> : PgDateStringBuilderInitial<''>;
export declare function date<TName extends string, TMode extends PgDateConfig['mode'] & {}>(name: TName, config?: PgDateConfig<TMode>): Equal<TMode, 'date'> extends true ? PgDateBuilderInitial<TName> : PgDateStringBuilderInitial<TName>;
