import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { type Writable } from "../../utils.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
export type SingleStoreCharBuilderInitial<TName extends string, TEnum extends [string, ...string[]], TLength extends number | undefined> = SingleStoreCharBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreChar';
    data: TEnum[number];
    driverParam: number | string;
    enumValues: TEnum;
    generated: undefined;
    length: TLength;
}>;
export declare class SingleStoreCharBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreChar'> & {
    length?: number | undefined;
}> extends SingleStoreColumnBuilder<T, SingleStoreCharConfig<T['enumValues'], T['length']>, {
    length: T['length'];
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: SingleStoreCharConfig<T['enumValues'], T['length']>);
}
export declare class SingleStoreChar<T extends ColumnBaseConfig<'string', 'SingleStoreChar'> & {
    length?: number | undefined;
}> extends SingleStoreColumn<T, SingleStoreCharConfig<T['enumValues'], T['length']>, {
    length: T['length'];
}> {
    static readonly [entityKind]: string;
    readonly length: T['length'];
    readonly enumValues: T["enumValues"] | undefined;
    getSQLType(): string;
}
export interface SingleStoreCharConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined, TLength extends number | undefined = number | undefined> {
    enum?: TEnum;
    length?: TLength;
}
export declare function char(): SingleStoreCharBuilderInitial<'', [string, ...string[]], undefined>;
export declare function char<U extends string, T extends Readonly<[U, ...U[]]>, L extends number | undefined>(config?: SingleStoreCharConfig<T | Writable<T>, L>): SingleStoreCharBuilderInitial<'', Writable<T>, L>;
export declare function char<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>, L extends number | undefined>(name: TName, config?: SingleStoreCharConfig<T | Writable<T>, L>): SingleStoreCharBuilderInitial<TName, Writable<T>, L>;
