import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import type { AnyGelTable } from "../table.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
export type GelDecimalBuilderInitial<TName extends string> = GelDecimalBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'GelDecimal';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class GelDecimalBuilder<T extends ColumnBuilderBaseConfig<'string', 'GelDecimal'>> extends GelColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelDecimal<T extends ColumnBaseConfig<'string', 'GelDecimal'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnyGelTable<{
        name: T['tableName'];
    }>, config: GelDecimalBuilder<T>['config']);
    getSQLType(): string;
}
export declare function decimal(): GelDecimalBuilderInitial<''>;
export declare function decimal<TName extends string>(name: TName): GelDecimalBuilderInitial<TName>;
