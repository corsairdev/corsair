import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { PgColumn, PgColumnBuilder } from "./common.cjs";
import type { Precision } from "./timestamp.cjs";
export type PgIntervalBuilderInitial<TName extends string> = PgIntervalBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgInterval';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgIntervalBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgInterval'>> extends PgColumnBuilder<T, {
    intervalConfig: IntervalConfig;
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], intervalConfig: IntervalConfig);
}
export declare class PgInterval<T extends ColumnBaseConfig<'string', 'PgInterval'>> extends PgColumn<T, {
    intervalConfig: IntervalConfig;
}> {
    static readonly [entityKind]: string;
    readonly fields: IntervalConfig['fields'];
    readonly precision: IntervalConfig['precision'];
    getSQLType(): string;
}
export interface IntervalConfig {
    fields?: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'year to month' | 'day to hour' | 'day to minute' | 'day to second' | 'hour to minute' | 'hour to second' | 'minute to second';
    precision?: Precision;
}
export declare function interval(): PgIntervalBuilderInitial<''>;
export declare function interval(config?: IntervalConfig): PgIntervalBuilderInitial<''>;
export declare function interval<TName extends string>(name: TName, config?: IntervalConfig): PgIntervalBuilderInitial<TName>;
