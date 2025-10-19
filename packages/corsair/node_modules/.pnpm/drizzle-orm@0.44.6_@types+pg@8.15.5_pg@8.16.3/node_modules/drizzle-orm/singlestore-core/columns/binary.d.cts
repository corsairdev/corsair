import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
export type SingleStoreBinaryBuilderInitial<TName extends string> = SingleStoreBinaryBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreBinary';
    data: string;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreBinaryBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreBinary'>> extends SingleStoreColumnBuilder<T, SingleStoreBinaryConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], length: number | undefined);
}
export declare class SingleStoreBinary<T extends ColumnBaseConfig<'string', 'SingleStoreBinary'>> extends SingleStoreColumn<T, SingleStoreBinaryConfig> {
    static readonly [entityKind]: string;
    length: number | undefined;
    mapFromDriverValue(value: string | Buffer | Uint8Array): string;
    getSQLType(): string;
}
export interface SingleStoreBinaryConfig {
    length?: number;
}
export declare function binary(): SingleStoreBinaryBuilderInitial<''>;
export declare function binary(config?: SingleStoreBinaryConfig): SingleStoreBinaryBuilderInitial<''>;
export declare function binary<TName extends string>(name: TName, config?: SingleStoreBinaryConfig): SingleStoreBinaryBuilderInitial<TName>;
