import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { PgColumn, PgColumnBuilder } from "./common.cjs";
export type PgDoublePrecisionBuilderInitial<TName extends string> = PgDoublePrecisionBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'PgDoublePrecision';
    data: number;
    driverParam: string | number;
    enumValues: undefined;
}>;
export declare class PgDoublePrecisionBuilder<T extends ColumnBuilderBaseConfig<'number', 'PgDoublePrecision'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgDoublePrecision<T extends ColumnBaseConfig<'number', 'PgDoublePrecision'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string | number): number;
}
export declare function doublePrecision(): PgDoublePrecisionBuilderInitial<''>;
export declare function doublePrecision<TName extends string>(name: TName): PgDoublePrecisionBuilderInitial<TName>;
