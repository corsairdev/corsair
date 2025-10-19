import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.cjs";
import type { SingleStoreIntConfig } from "./int.cjs";
export type SingleStoreMediumIntBuilderInitial<TName extends string> = SingleStoreMediumIntBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SingleStoreMediumInt';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreMediumIntBuilder<T extends ColumnBuilderBaseConfig<'number', 'SingleStoreMediumInt'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, SingleStoreIntConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config?: SingleStoreIntConfig);
}
export declare class SingleStoreMediumInt<T extends ColumnBaseConfig<'number', 'SingleStoreMediumInt'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreIntConfig> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function mediumint(): SingleStoreMediumIntBuilderInitial<''>;
export declare function mediumint(config?: SingleStoreIntConfig): SingleStoreMediumIntBuilderInitial<''>;
export declare function mediumint<TName extends string>(name: TName, config?: SingleStoreIntConfig): SingleStoreMediumIntBuilderInitial<TName>;
