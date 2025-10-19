import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
export type SingleStoreDoubleBuilderInitial<TName extends string> = SingleStoreDoubleBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SingleStoreDouble';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreDoubleBuilder<T extends ColumnBuilderBaseConfig<'number', 'SingleStoreDouble'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, SingleStoreDoubleConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: SingleStoreDoubleConfig | undefined);
}
export declare class SingleStoreDouble<T extends ColumnBaseConfig<'number', 'SingleStoreDouble'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreDoubleConfig> {
    static readonly [entityKind]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    readonly unsigned: boolean | undefined;
    getSQLType(): string;
}
export interface SingleStoreDoubleConfig {
    precision?: number;
    scale?: number;
    unsigned?: boolean;
}
export declare function double(): SingleStoreDoubleBuilderInitial<''>;
export declare function double(config?: SingleStoreDoubleConfig): SingleStoreDoubleBuilderInitial<''>;
export declare function double<TName extends string>(name: TName, config?: SingleStoreDoubleConfig): SingleStoreDoubleBuilderInitial<TName>;
