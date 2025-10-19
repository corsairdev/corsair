import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { GelColumn, GelColumnBuilder } from "./common.js";
export type GelUUIDBuilderInitial<TName extends string> = GelUUIDBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'GelUUID';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class GelUUIDBuilder<T extends ColumnBuilderBaseConfig<'string', 'GelUUID'>> extends GelColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelUUID<T extends ColumnBaseConfig<'string', 'GelUUID'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function uuid(): GelUUIDBuilderInitial<''>;
export declare function uuid<TName extends string>(name: TName): GelUUIDBuilderInitial<TName>;
