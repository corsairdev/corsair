import type { ColumnBuilderBaseConfig } from "../../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../../column.cjs";
import { entityKind } from "../../../entity.cjs";
import { PgColumn, PgColumnBuilder } from "../common.cjs";
export type PgVectorBuilderInitial<TName extends string, TDimensions extends number> = PgVectorBuilder<{
    name: TName;
    dataType: 'array';
    columnType: 'PgVector';
    data: number[];
    driverParam: string;
    enumValues: undefined;
    dimensions: TDimensions;
}>;
export declare class PgVectorBuilder<T extends ColumnBuilderBaseConfig<'array', 'PgVector'> & {
    dimensions: number;
}> extends PgColumnBuilder<T, {
    dimensions: T['dimensions'];
}, {
    dimensions: T['dimensions'];
}> {
    static readonly [entityKind]: string;
    constructor(name: string, config: PgVectorConfig<T['dimensions']>);
}
export declare class PgVector<T extends ColumnBaseConfig<'array', 'PgVector'> & {
    dimensions: number | undefined;
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
export interface PgVectorConfig<TDimensions extends number = number> {
    dimensions: TDimensions;
}
export declare function vector<D extends number>(config: PgVectorConfig<D>): PgVectorBuilderInitial<'', D>;
export declare function vector<TName extends string, D extends number>(name: TName, config: PgVectorConfig<D>): PgVectorBuilderInitial<TName, D>;
