import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { type Writable } from "../../utils.cjs";
import { MySqlColumn, MySqlColumnBuilder } from "./common.cjs";
export type MySqlVarCharBuilderInitial<TName extends string, TEnum extends [string, ...string[]], TLength extends number | undefined> = MySqlVarCharBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlVarChar';
    data: TEnum[number];
    driverParam: number | string;
    enumValues: TEnum;
    length: TLength;
}>;
export declare class MySqlVarCharBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlVarChar'> & {
    length?: number | undefined;
}> extends MySqlColumnBuilder<T, MySqlVarCharConfig<T['enumValues'], T['length']>> {
    static readonly [entityKind]: string;
}
export declare class MySqlVarChar<T extends ColumnBaseConfig<'string', 'MySqlVarChar'> & {
    length?: number | undefined;
}> extends MySqlColumn<T, MySqlVarCharConfig<T['enumValues'], T['length']>, {
    length: T['length'];
}> {
    static readonly [entityKind]: string;
    readonly length: number | undefined;
    readonly enumValues: T["enumValues"] | undefined;
    getSQLType(): string;
}
export interface MySqlVarCharConfig<TEnum extends string[] | readonly string[] | undefined = string[] | readonly string[] | undefined, TLength extends number | undefined = number | undefined> {
    enum?: TEnum;
    length: TLength;
}
export declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>, L extends number | undefined>(config: MySqlVarCharConfig<T | Writable<T>, L>): MySqlVarCharBuilderInitial<'', Writable<T>, L>;
export declare function varchar<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>, L extends number | undefined>(name: TName, config: MySqlVarCharConfig<T | Writable<T>, L>): MySqlVarCharBuilderInitial<TName, Writable<T>, L>;
