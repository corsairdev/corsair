import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { PgColumn } from "./common.js";
import { PgIntColumnBaseBuilder } from "./int.common.js";
export type PgIntegerBuilderInitial<TName extends string> = PgIntegerBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'PgInteger';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class PgIntegerBuilder<T extends ColumnBuilderBaseConfig<'number', 'PgInteger'>> extends PgIntColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgInteger<T extends ColumnBaseConfig<'number', 'PgInteger'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function integer(): PgIntegerBuilderInitial<''>;
export declare function integer<TName extends string>(name: TName): PgIntegerBuilderInitial<TName>;
