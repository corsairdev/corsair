import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { AnyGelTable } from "../table.cjs";
import { GelColumn } from "./common.cjs";
import { GelLocalDateColumnBaseBuilder } from "./date.common.cjs";
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
