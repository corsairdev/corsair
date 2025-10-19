import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
export type SingleStoreJsonBuilderInitial<TName extends string> = SingleStoreJsonBuilder<{
    name: TName;
    dataType: 'json';
    columnType: 'SingleStoreJson';
    data: unknown;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreJsonBuilder<T extends ColumnBuilderBaseConfig<'json', 'SingleStoreJson'>> extends SingleStoreColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SingleStoreJson<T extends ColumnBaseConfig<'json', 'SingleStoreJson'>> extends SingleStoreColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapToDriverValue(value: T['data']): string;
}
export declare function json(): SingleStoreJsonBuilderInitial<''>;
export declare function json<TName extends string>(name: TName): SingleStoreJsonBuilderInitial<TName>;
