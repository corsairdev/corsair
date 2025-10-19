import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { type Writable } from "../../utils.cjs";
import { MySqlColumn, MySqlColumnBuilder } from "./common.cjs";
export type MySqlCharBuilderInitial<TName extends string, TEnum extends [string, ...string[]], TLength extends number | undefined> = MySqlCharBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlChar';
    data: TEnum[number];
    driverParam: number | string;
    enumValues: TEnum;
    length: TLength;
}>;
export declare class MySqlCharBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlChar'> & {
    length?: number | undefined;
}> extends MySqlColumnBuilder<T, MySqlCharConfig<T['enumValues'], T['length']>, {
    length: T['length'];
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: MySqlCharConfig<T['enumValues'], T['length']>);
}
export declare class MySqlChar<T extends ColumnBaseConfig<'string', 'MySqlChar'> & {
    length?: number | undefined;
}> extends MySqlColumn<T, MySqlCharConfig<T['enumValues'], T['length']>, {
    length: T['length'];
}> {
    static readonly [entityKind]: string;
    readonly length: T['length'];
    readonly enumValues: T["enumValues"] | undefined;
    getSQLType(): string;
}
export interface MySqlCharConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined, TLength extends number | undefined = number | undefined> {
    enum?: TEnum;
    length?: TLength;
}
export declare function char(): MySqlCharBuilderInitial<'', [string, ...string[]], undefined>;
export declare function char<U extends string, T extends Readonly<[U, ...U[]]>, L extends number | undefined>(config?: MySqlCharConfig<T | Writable<T>, L>): MySqlCharBuilderInitial<'', Writable<T>, L>;
export declare function char<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>, L extends number | undefined>(name: TName, config?: MySqlCharConfig<T | Writable<T>, L>): MySqlCharBuilderInitial<TName, Writable<T>, L>;
