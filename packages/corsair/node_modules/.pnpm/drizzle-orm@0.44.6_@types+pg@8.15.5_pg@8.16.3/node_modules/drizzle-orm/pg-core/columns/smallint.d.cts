import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { PgColumn } from "./common.cjs";
import { PgIntColumnBaseBuilder } from "./int.common.cjs";
export type PgSmallIntBuilderInitial<TName extends string> = PgSmallIntBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'PgSmallInt';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class PgSmallIntBuilder<T extends ColumnBuilderBaseConfig<'number', 'PgSmallInt'>> extends PgIntColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgSmallInt<T extends ColumnBaseConfig<'number', 'PgSmallInt'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue: (value: number | string) => number;
}
export declare function smallint(): PgSmallIntBuilderInitial<''>;
export declare function smallint<TName extends string>(name: TName): PgSmallIntBuilderInitial<TName>;
