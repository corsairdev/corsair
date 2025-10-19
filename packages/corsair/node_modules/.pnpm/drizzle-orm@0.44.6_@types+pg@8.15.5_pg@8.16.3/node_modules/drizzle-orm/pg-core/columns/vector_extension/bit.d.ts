import type { ColumnBuilderBaseConfig } from "../../../column-builder.js";
import type { ColumnBaseConfig } from "../../../column.js";
import { entityKind } from "../../../entity.js";
import { PgColumn, PgColumnBuilder } from "../common.js";
export type PgBinaryVectorBuilderInitial<TName extends string, TDimensions extends number> = PgBinaryVectorBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgBinaryVector';
    data: string;
    driverParam: string;
    enumValues: undefined;
    dimensions: TDimensions;
}>;
export declare class PgBinaryVectorBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgBinaryVector'> & {
    dimensions: number;
}> extends PgColumnBuilder<T, {
    dimensions: T['dimensions'];
}> {
    static readonly [entityKind]: string;
    constructor(name: string, config: PgBinaryVectorConfig<T['dimensions']>);
}
export declare class PgBinaryVector<T extends ColumnBaseConfig<'string', 'PgBinaryVector'> & {
    dimensions: number;
}> extends PgColumn<T, {
    dimensions: T['dimensions'];
}, {
    dimensions: T['dimensions'];
}> {
    static readonly [entityKind]: string;
    readonly dimensions: T["dimensions"];
    getSQLType(): string;
}
export interface PgBinaryVectorConfig<TDimensions extends number = number> {
    dimensions: TDimensions;
}
export declare function bit<D extends number>(config: PgBinaryVectorConfig<D>): PgBinaryVectorBuilderInitial<'', D>;
export declare function bit<TName extends string, D extends number>(name: TName, config: PgBinaryVectorConfig<D>): PgBinaryVectorBuilderInitial<TName, D>;
