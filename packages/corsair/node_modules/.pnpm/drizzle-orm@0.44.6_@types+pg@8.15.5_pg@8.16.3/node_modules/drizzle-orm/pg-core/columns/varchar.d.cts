import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { type Writable } from "../../utils.cjs";
import { PgColumn, PgColumnBuilder } from "./common.cjs";
export type PgVarcharBuilderInitial<TName extends string, TEnum extends [string, ...string[]], TLength extends number | undefined> = PgVarcharBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgVarchar';
    data: TEnum[number];
    driverParam: string;
    enumValues: TEnum;
    length: TLength;
}>;
export declare class PgVarcharBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgVarchar'> & {
    length?: number | undefined;
}> extends PgColumnBuilder<T, {
    length: T['length'];
    enumValues: T['enumValues'];
}, {
    length: T['length'];
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: PgVarcharConfig<T['enumValues'], T['length']>);
}
export declare class PgVarchar<T extends ColumnBaseConfig<'string', 'PgVarchar'> & {
    length?: number | undefined;
}> extends PgColumn<T, {
    length: T['length'];
    enumValues: T['enumValues'];
}, {
    length: T['length'];
}> {
    static readonly [entityKind]: string;
    readonly length: T["length"];
    readonly enumValues: T["enumValues"];
    getSQLType(): string;
}
export interface PgVarcharConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined, TLength extends number | undefined = number | undefined> {
    enum?: TEnum;
    length?: TLength;
}
export declare function varchar(): PgVarcharBuilderInitial<'', [string, ...string[]], undefined>;
export declare function varchar<U extends string, T extends Readonly<[U, ...U[]]>, L extends number | undefined>(config?: PgVarcharConfig<T | Writable<T>, L>): PgVarcharBuilderInitial<'', Writable<T>, L>;
export declare function varchar<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>, L extends number | undefined>(name: TName, config?: PgVarcharConfig<T | Writable<T>, L>): PgVarcharBuilderInitial<TName, Writable<T>, L>;
