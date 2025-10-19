import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { SQLiteColumn, SQLiteColumnBuilder } from "./common.js";
export type SQLiteRealBuilderInitial<TName extends string> = SQLiteRealBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SQLiteReal';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>;
export declare class SQLiteRealBuilder<T extends ColumnBuilderBaseConfig<'number', 'SQLiteReal'>> extends SQLiteColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SQLiteReal<T extends ColumnBaseConfig<'number', 'SQLiteReal'>> extends SQLiteColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function real(): SQLiteRealBuilderInitial<''>;
export declare function real<TName extends string>(name: TName): SQLiteRealBuilderInitial<TName>;
