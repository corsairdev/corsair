import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { type Equal } from "../../utils.cjs";
import { MySqlDateBaseColumn, MySqlDateColumnBaseBuilder } from "./date.common.cjs";
export type MySqlTimestampBuilderInitial<TName extends string> = MySqlTimestampBuilder<{
    name: TName;
    dataType: 'date';
    columnType: 'MySqlTimestamp';
    data: Date;
    driverParam: string | number;
    enumValues: undefined;
}>;
export declare class MySqlTimestampBuilder<T extends ColumnBuilderBaseConfig<'date', 'MySqlTimestamp'>> extends MySqlDateColumnBaseBuilder<T, MySqlTimestampConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: MySqlTimestampConfig | undefined);
}
export declare class MySqlTimestamp<T extends ColumnBaseConfig<'date', 'MySqlTimestamp'>> extends MySqlDateBaseColumn<T, MySqlTimestampConfig> {
    static readonly [entityKind]: string;
    readonly fsp: number | undefined;
    getSQLType(): string;
    mapFromDriverValue(value: string): Date;
    mapToDriverValue(value: Date): string;
}
export type MySqlTimestampStringBuilderInitial<TName extends string> = MySqlTimestampStringBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlTimestampString';
    data: string;
    driverParam: string | number;
    enumValues: undefined;
}>;
export declare class MySqlTimestampStringBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlTimestampString'>> extends MySqlDateColumnBaseBuilder<T, MySqlTimestampConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: MySqlTimestampConfig | undefined);
}
export declare class MySqlTimestampString<T extends ColumnBaseConfig<'string', 'MySqlTimestampString'>> extends MySqlDateBaseColumn<T, MySqlTimestampConfig> {
    static readonly [entityKind]: string;
    readonly fsp: number | undefined;
    getSQLType(): string;
}
export type TimestampFsp = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface MySqlTimestampConfig<TMode extends 'string' | 'date' = 'string' | 'date'> {
    mode?: TMode;
    fsp?: TimestampFsp;
}
export declare function timestamp(): MySqlTimestampBuilderInitial<''>;
export declare function timestamp<TMode extends MySqlTimestampConfig['mode'] & {}>(config?: MySqlTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlTimestampStringBuilderInitial<''> : MySqlTimestampBuilderInitial<''>;
export declare function timestamp<TName extends string, TMode extends MySqlTimestampConfig['mode'] & {}>(name: TName, config?: MySqlTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? MySqlTimestampStringBuilderInitial<TName> : MySqlTimestampBuilderInitial<TName>;
