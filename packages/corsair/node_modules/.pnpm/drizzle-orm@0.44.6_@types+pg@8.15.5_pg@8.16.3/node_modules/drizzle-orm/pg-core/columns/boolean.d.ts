import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
export type PgBooleanBuilderInitial<TName extends string> = PgBooleanBuilder<{
    name: TName;
    dataType: 'boolean';
    columnType: 'PgBoolean';
    data: boolean;
    driverParam: boolean;
    enumValues: undefined;
}>;
export declare class PgBooleanBuilder<T extends ColumnBuilderBaseConfig<'boolean', 'PgBoolean'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgBoolean<T extends ColumnBaseConfig<'boolean', 'PgBoolean'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function boolean(): PgBooleanBuilderInitial<''>;
export declare function boolean<TName extends string>(name: TName): PgBooleanBuilderInitial<TName>;
