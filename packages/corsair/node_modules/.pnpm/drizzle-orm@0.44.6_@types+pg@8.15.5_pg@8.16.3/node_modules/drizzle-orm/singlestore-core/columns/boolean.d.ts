import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
export type SingleStoreBooleanBuilderInitial<TName extends string> = SingleStoreBooleanBuilder<{
    name: TName;
    dataType: 'boolean';
    columnType: 'SingleStoreBoolean';
    data: boolean;
    driverParam: number | boolean;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreBooleanBuilder<T extends ColumnBuilderBaseConfig<'boolean', 'SingleStoreBoolean'>> extends SingleStoreColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SingleStoreBoolean<T extends ColumnBaseConfig<'boolean', 'SingleStoreBoolean'>> extends SingleStoreColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | boolean): boolean;
}
export declare function boolean(): SingleStoreBooleanBuilderInitial<''>;
export declare function boolean<TName extends string>(name: TName): SingleStoreBooleanBuilderInitial<TName>;
