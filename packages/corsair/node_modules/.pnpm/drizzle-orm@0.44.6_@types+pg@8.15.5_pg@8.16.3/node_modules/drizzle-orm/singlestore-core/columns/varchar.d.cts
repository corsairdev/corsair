import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { type Writable } from "../../utils.cjs";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
export type SingleStoreVarCharBuilderInitial<TName extends string, TEnum extends [string, ...string[]], TLength extends number | undefined> = SingleStoreVarCharBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreVarChar';
    data: TEnum[number];
    driverParam: number | string;
    enumValues: TEnum;
    generated: undefined;
    length: TLength;
}>;
export declare class SingleStoreVarCharBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreVarChar'> & {
    length?: number | undefined;
}> extends SingleStoreColumnBuilder<T, SingleStoreVarCharConfig<T['enumValues'], T['length']>, {
    length: T['length'];
}> {
    static readonly [entityKind]: string;
}
export declare class SingleStoreVarChar<T extends ColumnBaseConfig<'string', 'SingleStoreVarChar'> & {
    length?: number | undefined;
}> extends SingleStoreColumn<T, SingleStoreVarCharConfig<T['enumValues'], T['length']>, {
    length: T['length'];
}> {
    static readonly [entityKind]: string;
    readonly length: T['length'];
    readonly enumValues: T["enumValues"] | undefined;
    getSQLType(): string;
}
export interface SingleStoreVarCharConfig<TEnum extends string[] | readonly string[] | undefined = string[] | readonly string[] | undefined, TLength extends number | undefined = number | undefined> {
    enum?: TEnum;
    length: TLength;
}
export declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>, L extends number | undefined>(config: SingleStoreVarCharConfig<T | Writable<T>, L>): SingleStoreVarCharBuilderInitial<'', Writable<T>, L>;
export declare function varchar<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>, L extends number | undefined>(name: TName, config: SingleStoreVarCharConfig<T | Writable<T>, L>): SingleStoreVarCharBuilderInitial<TName, Writable<T>, L>;
