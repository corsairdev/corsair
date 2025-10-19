import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.cjs";
import type { SingleStoreIntConfig } from "./int.cjs";
export type SingleStoreSmallIntBuilderInitial<TName extends string> = SingleStoreSmallIntBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SingleStoreSmallInt';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreSmallIntBuilder<T extends ColumnBuilderBaseConfig<'number', 'SingleStoreSmallInt'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, SingleStoreIntConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config?: SingleStoreIntConfig);
}
export declare class SingleStoreSmallInt<T extends ColumnBaseConfig<'number', 'SingleStoreSmallInt'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreIntConfig> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function smallint(): SingleStoreSmallIntBuilderInitial<''>;
export declare function smallint(config?: SingleStoreIntConfig): SingleStoreSmallIntBuilderInitial<''>;
export declare function smallint<TName extends string>(name: TName, config?: SingleStoreIntConfig): SingleStoreSmallIntBuilderInitial<TName>;
