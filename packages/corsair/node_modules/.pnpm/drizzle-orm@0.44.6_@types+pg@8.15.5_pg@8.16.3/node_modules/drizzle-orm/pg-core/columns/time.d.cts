import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { AnyPgTable } from "../table.cjs";
import { PgColumn } from "./common.cjs";
import { PgDateColumnBaseBuilder } from "./date.common.cjs";
import type { Precision } from "./timestamp.cjs";
export type PgTimeBuilderInitial<TName extends string> = PgTimeBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgTime';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgTimeBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgTime'>> extends PgDateColumnBaseBuilder<T, {
    withTimezone: boolean;
    precision: number | undefined;
}> {
    readonly withTimezone: boolean;
    readonly precision: number | undefined;
    static readonly [entityKind]: string;
    constructor(name: T['name'], withTimezone: boolean, precision: number | undefined);
}
export declare class PgTime<T extends ColumnBaseConfig<'string', 'PgTime'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    readonly withTimezone: boolean;
    readonly precision: number | undefined;
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgTimeBuilder<T>['config']);
    getSQLType(): string;
}
export interface TimeConfig {
    precision?: Precision;
    withTimezone?: boolean;
}
export declare function time(): PgTimeBuilderInitial<''>;
export declare function time(config?: TimeConfig): PgTimeBuilderInitial<''>;
export declare function time<TName extends string>(name: TName, config?: TimeConfig): PgTimeBuilderInitial<TName>;
