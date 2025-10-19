import type { ColumnBuilderBaseConfig, GeneratedColumnConfig, HasGenerated } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import type { SQL } from "../../sql/index.js";
import { type Writable } from "../../utils.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
export type SingleStoreEnumColumnBuilderInitial<TName extends string, TEnum extends [string, ...string[]]> = SingleStoreEnumColumnBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreEnumColumn';
    data: TEnum[number];
    driverParam: string;
    enumValues: TEnum;
    generated: undefined;
}>;
export declare class SingleStoreEnumColumnBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreEnumColumn'>> extends SingleStoreColumnBuilder<T, {
    enumValues: T['enumValues'];
}> {
    generatedAlwaysAs(as: SQL<unknown> | (() => SQL) | T['data'], config?: Partial<GeneratedColumnConfig<unknown>>): HasGenerated<this, {}>;
    static readonly [entityKind]: string;
    constructor(name: T['name'], values: T['enumValues']);
}
export declare class SingleStoreEnumColumn<T extends ColumnBaseConfig<'string', 'SingleStoreEnumColumn'>> extends SingleStoreColumn<T, {
    enumValues: T['enumValues'];
}> {
    static readonly [entityKind]: string;
    readonly enumValues: T["enumValues"];
    getSQLType(): string;
}
export declare function singlestoreEnum<U extends string, T extends Readonly<[U, ...U[]]>>(values: T | Writable<T>): SingleStoreEnumColumnBuilderInitial<'', Writable<T>>;
export declare function singlestoreEnum<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>>(name: TName, values: T | Writable<T>): SingleStoreEnumColumnBuilderInitial<TName, Writable<T>>;
