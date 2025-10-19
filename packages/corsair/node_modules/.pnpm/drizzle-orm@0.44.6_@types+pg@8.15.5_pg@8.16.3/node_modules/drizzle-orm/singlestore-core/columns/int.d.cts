import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.cjs";
export type SingleStoreIntBuilderInitial<TName extends string> = SingleStoreIntBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SingleStoreInt';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreIntBuilder<T extends ColumnBuilderBaseConfig<'number', 'SingleStoreInt'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, SingleStoreIntConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config?: SingleStoreIntConfig);
}
export declare class SingleStoreInt<T extends ColumnBaseConfig<'number', 'SingleStoreInt'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreIntConfig> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export interface SingleStoreIntConfig {
    unsigned?: boolean;
}
export declare function int(): SingleStoreIntBuilderInitial<''>;
export declare function int(config?: SingleStoreIntConfig): SingleStoreIntBuilderInitial<''>;
export declare function int<TName extends string>(name: TName, config?: SingleStoreIntConfig): SingleStoreIntBuilderInitial<TName>;
