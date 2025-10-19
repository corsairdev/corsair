import type { ColumnBuilderBaseConfig } from "../../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../../column.cjs";
import { entityKind } from "../../../entity.cjs";
import { PgColumn, PgColumnBuilder } from "../common.cjs";
export type PgHalfVectorBuilderInitial<TName extends string, TDimensions extends number> = PgHalfVectorBuilder<{
    name: TName;
    dataType: 'array';
    columnType: 'PgHalfVector';
    data: number[];
    driverParam: string;
    enumValues: undefined;
    dimensions: TDimensions;
}>;
export declare class PgHalfVectorBuilder<T extends ColumnBuilderBaseConfig<'array', 'PgHalfVector'> & {
    dimensions: number;
}> extends PgColumnBuilder<T, {
    dimensions: T['dimensions'];
}, {
    dimensions: T['dimensions'];
}> {
    static readonly [entityKind]: string;
    constructor(name: string, config: PgHalfVectorConfig<T['dimensions']>);
}
export declare class PgHalfVector<T extends ColumnBaseConfig<'array', 'PgHalfVector'> & {
    dimensions: number;
}> extends PgColumn<T, {
    dimensions: T['dimensions'];
}, {
    dimensions: T['dimensions'];
}> {
    static readonly [entityKind]: string;
    readonly dimensions: T['dimensions'];
    getSQLType(): string;
    mapToDriverValue(value: unknown): unknown;
    mapFromDriverValue(value: string): unknown;
}
export interface PgHalfVectorConfig<TDimensions extends number = number> {
    dimensions: TDimensions;
}
export declare function halfvec<D extends number>(config: PgHalfVectorConfig<D>): PgHalfVectorBuilderInitial<'', D>;
export declare function halfvec<TName extends string, D extends number>(name: TName, config: PgHalfVectorConfig): PgHalfVectorBuilderInitial<TName, D>;
