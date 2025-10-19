import type { LocalDateTime } from 'gel';
import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { AnyGelTable } from "../table.cjs";
import { GelColumn } from "./common.cjs";
import { GelLocalDateColumnBaseBuilder } from "./date.common.cjs";
export type GelTimestampBuilderInitial<TName extends string> = GelTimestampBuilder<{
    name: TName;
    dataType: 'localDateTime';
    columnType: 'GelTimestamp';
    data: LocalDateTime;
    driverParam: LocalDateTime;
    enumValues: undefined;
}>;
export declare class GelTimestampBuilder<T extends ColumnBuilderBaseConfig<'localDateTime', 'GelTimestamp'>> extends GelLocalDateColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelTimestamp<T extends ColumnBaseConfig<'localDateTime', 'GelTimestamp'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnyGelTable<{
        name: T['tableName'];
    }>, config: GelTimestampBuilder<T>['config']);
    getSQLType(): string;
}
export declare function timestamp(): GelTimestampBuilderInitial<''>;
export declare function timestamp<TName extends string>(name: TName): GelTimestampBuilderInitial<TName>;
