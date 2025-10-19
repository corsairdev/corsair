import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
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
