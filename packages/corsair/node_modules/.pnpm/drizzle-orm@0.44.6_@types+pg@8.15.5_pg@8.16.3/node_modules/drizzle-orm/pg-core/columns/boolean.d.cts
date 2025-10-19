import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { PgColumn, PgColumnBuilder } from "./common.cjs";
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
