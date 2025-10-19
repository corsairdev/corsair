import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
export type SingleStoreVarBinaryBuilderInitial<TName extends string> = SingleStoreVarBinaryBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreVarBinary';
    data: string;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreVarBinaryBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreVarBinary'>> extends SingleStoreColumnBuilder<T, SingleStoreVarbinaryOptions> {
    static readonly [entityKind]: string;
}
export declare class SingleStoreVarBinary<T extends ColumnBaseConfig<'string', 'SingleStoreVarBinary'>> extends SingleStoreColumn<T, SingleStoreVarbinaryOptions> {
    static readonly [entityKind]: string;
    length: number | undefined;
    mapFromDriverValue(value: string | Buffer | Uint8Array): string;
    getSQLType(): string;
}
export interface SingleStoreVarbinaryOptions {
    length: number;
}
export declare function varbinary(config: SingleStoreVarbinaryOptions): SingleStoreVarBinaryBuilderInitial<''>;
export declare function varbinary<TName extends string>(name: TName, config: SingleStoreVarbinaryOptions): SingleStoreVarBinaryBuilderInitial<TName>;
