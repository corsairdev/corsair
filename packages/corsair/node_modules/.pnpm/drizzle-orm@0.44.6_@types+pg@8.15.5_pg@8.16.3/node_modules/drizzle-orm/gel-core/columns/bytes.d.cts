import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { GelColumn, GelColumnBuilder } from "./common.cjs";
export type GelBytesBuilderInitial<TName extends string> = GelBytesBuilder<{
    name: TName;
    dataType: 'buffer';
    columnType: 'GelBytes';
    data: Uint8Array;
    driverParam: Uint8Array | Buffer;
    enumValues: undefined;
}>;
export declare class GelBytesBuilder<T extends ColumnBuilderBaseConfig<'buffer', 'GelBytes'>> extends GelColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class GelBytes<T extends ColumnBaseConfig<'buffer', 'GelBytes'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function bytes(): GelBytesBuilderInitial<''>;
export declare function bytes<TName extends string>(name: TName): GelBytesBuilderInitial<TName>;
