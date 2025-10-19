import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
import type { SingleStoreIntConfig } from "./int.js";
export type SingleStoreTinyIntBuilderInitial<TName extends string> = SingleStoreTinyIntBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SingleStoreTinyInt';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreTinyIntBuilder<T extends ColumnBuilderBaseConfig<'number', 'SingleStoreTinyInt'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, SingleStoreIntConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config?: SingleStoreIntConfig);
}
export declare class SingleStoreTinyInt<T extends ColumnBaseConfig<'number', 'SingleStoreTinyInt'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreIntConfig> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function tinyint(): SingleStoreTinyIntBuilderInitial<''>;
export declare function tinyint(config?: SingleStoreIntConfig): SingleStoreTinyIntBuilderInitial<''>;
export declare function tinyint<TName extends string>(name: TName, config?: SingleStoreIntConfig): SingleStoreTinyIntBuilderInitial<TName>;
