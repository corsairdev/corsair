import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { AnyPgTable } from "../table.cjs";
import { type Equal } from "../../utils.cjs";
import { PgColumn } from "./common.cjs";
import { PgDateColumnBaseBuilder } from "./date.common.cjs";
export type PgTimestampBuilderInitial<TName extends string> = PgTimestampBuilder<{
    name: TName;
    dataType: 'date';
    columnType: 'PgTimestamp';
    data: Date;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgTimestampBuilder<T extends ColumnBuilderBaseConfig<'date', 'PgTimestamp'>> extends PgDateColumnBaseBuilder<T, {
    withTimezone: boolean;
    precision: number | undefined;
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], withTimezone: boolean, precision: number | undefined);
}
export declare class PgTimestamp<T extends ColumnBaseConfig<'date', 'PgTimestamp'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    readonly withTimezone: boolean;
    readonly precision: number | undefined;
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgTimestampBuilder<T>['config']);
    getSQLType(): string;
    mapFromDriverValue: (value: string) => Date | null;
    mapToDriverValue: (value: Date) => string;
}
export type PgTimestampStringBuilderInitial<TName extends string> = PgTimestampStringBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgTimestampString';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgTimestampStringBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgTimestampString'>> extends PgDateColumnBaseBuilder<T, {
    withTimezone: boolean;
    precision: number | undefined;
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], withTimezone: boolean, precision: number | undefined);
}
export declare class PgTimestampString<T extends ColumnBaseConfig<'string', 'PgTimestampString'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    readonly withTimezone: boolean;
    readonly precision: number | undefined;
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgTimestampStringBuilder<T>['config']);
    getSQLType(): string;
}
export type Precision = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface PgTimestampConfig<TMode extends 'date' | 'string' = 'date' | 'string'> {
    mode?: TMode;
    precision?: Precision;
    withTimezone?: boolean;
}
export declare function timestamp(): PgTimestampBuilderInitial<''>;
export declare function timestamp<TMode extends PgTimestampConfig['mode'] & {}>(config?: PgTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? PgTimestampStringBuilderInitial<''> : PgTimestampBuilderInitial<''>;
export declare function timestamp<TName extends string, TMode extends PgTimestampConfig['mode'] & {}>(name: TName, config?: PgTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? PgTimestampStringBuilderInitial<TName> : PgTimestampBuilderInitial<TName>;
