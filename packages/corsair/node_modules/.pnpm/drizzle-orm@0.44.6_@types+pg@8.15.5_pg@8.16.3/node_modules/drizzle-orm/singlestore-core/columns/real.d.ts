import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
export type SingleStoreRealBuilderInitial<TName extends string> = SingleStoreRealBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SingleStoreReal';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreRealBuilder<T extends ColumnBuilderBaseConfig<'number', 'SingleStoreReal'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, SingleStoreRealConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: SingleStoreRealConfig | undefined);
}
export declare class SingleStoreReal<T extends ColumnBaseConfig<'number', 'SingleStoreReal'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreRealConfig> {
    static readonly [entityKind]: string;
    precision: number | undefined;
    scale: number | undefined;
    getSQLType(): string;
}
export interface SingleStoreRealConfig {
    precision?: number;
    scale?: number;
}
export declare function real(): SingleStoreRealBuilderInitial<''>;
export declare function real(config?: SingleStoreRealConfig): SingleStoreRealBuilderInitial<''>;
export declare function real<TName extends string>(name: TName, config?: SingleStoreRealConfig): SingleStoreRealBuilderInitial<TName>;
