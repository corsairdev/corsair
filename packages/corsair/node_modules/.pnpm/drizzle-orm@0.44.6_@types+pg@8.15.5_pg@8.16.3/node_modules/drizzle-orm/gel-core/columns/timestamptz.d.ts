import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import type { AnyGelTable } from "../table.js";
import { GelColumn } from "./common.js";
import { GelLocalDateColumnBaseBuilder } from "./date.common.js";
export type GelTimestampTzBuilderInitial<TName extends string> = GelTimestampTzBuilder<{
    name: TName;
    dataType: 'date';
    columnType: 'GelTimestampTz';
    data: Date;
    driverParam: Date;
    enumValues: undefined;
}>;
export declare class GelTimestampTzBuilder<T extends ColumnBuilderBaseConfig<'date', 'GelTimestampTz'>> extends GelLocalDateColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelTimestampTz<T extends ColumnBaseConfig<'date', 'GelTimestampTz'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnyGelTable<{
        name: T['tableName'];
    }>, config: GelTimestampTzBuilder<T>['config']);
    getSQLType(): string;
}
export declare function timestamptz(): GelTimestampTzBuilderInitial<''>;
export declare function timestamptz<TName extends string>(name: TName): GelTimestampTzBuilderInitial<TName>;
