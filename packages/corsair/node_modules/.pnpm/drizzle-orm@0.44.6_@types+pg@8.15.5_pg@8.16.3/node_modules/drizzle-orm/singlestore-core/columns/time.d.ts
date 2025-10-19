import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
export type SingleStoreTimeBuilderInitial<TName extends string> = SingleStoreTimeBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreTime';
    data: string;
    driverParam: string | number;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreTimeBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreTime'>> extends SingleStoreColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SingleStoreTime<T extends ColumnBaseConfig<'string', 'SingleStoreTime'>> extends SingleStoreColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function time(): SingleStoreTimeBuilderInitial<''>;
export declare function time<TName extends string>(name: TName): SingleStoreTimeBuilderInitial<TName>;
