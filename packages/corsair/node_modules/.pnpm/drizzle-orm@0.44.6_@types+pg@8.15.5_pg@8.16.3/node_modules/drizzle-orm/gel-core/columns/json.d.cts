import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { AnyGelTable } from "../table.cjs";
import { GelColumn, GelColumnBuilder } from "./common.cjs";
export type GelJsonBuilderInitial<TName extends string> = GelJsonBuilder<{
    name: TName;
    dataType: 'json';
    columnType: 'GelJson';
    data: unknown;
    driverParam: unknown;
    enumValues: undefined;
}>;
export declare class GelJsonBuilder<T extends ColumnBuilderBaseConfig<'json', 'GelJson'>> extends GelColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelJson<T extends ColumnBaseConfig<'json', 'GelJson'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnyGelTable<{
        name: T['tableName'];
    }>, config: GelJsonBuilder<T>['config']);
    getSQLType(): string;
}
export declare function json(): GelJsonBuilderInitial<''>;
export declare function json<TName extends string>(name: TName): GelJsonBuilderInitial<TName>;
