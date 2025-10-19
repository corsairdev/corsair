import type { ColumnBuilderBaseConfig } from "../../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../../column.cjs";
import { entityKind } from "../../../entity.cjs";
import { PgColumn, PgColumnBuilder } from "../common.cjs";
export type PgSparseVectorBuilderInitial<TName extends string> = PgSparseVectorBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgSparseVector';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgSparseVectorBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgSparseVector'>> extends PgColumnBuilder<T, {
    dimensions: number | undefined;
}> {
    static readonly [entityKind]: string;
    constructor(name: string, config: PgSparseVectorConfig);
}
export declare class PgSparseVector<T extends ColumnBaseConfig<'string', 'PgSparseVector'>> extends PgColumn<T, {
    dimensions: number | undefined;
}> {
    static readonly [entityKind]: string;
    readonly dimensions: number | undefined;
    getSQLType(): string;
}
export interface PgSparseVectorConfig {
    dimensions: number;
}
export declare function sparsevec(config: PgSparseVectorConfig): PgSparseVectorBuilderInitial<''>;
export declare function sparsevec<TName extends string>(name: TName, config: PgSparseVectorConfig): PgSparseVectorBuilderInitial<TName>;
