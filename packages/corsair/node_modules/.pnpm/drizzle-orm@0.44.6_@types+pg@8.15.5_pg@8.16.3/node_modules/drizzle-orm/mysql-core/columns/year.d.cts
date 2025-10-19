import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { MySqlColumn, MySqlColumnBuilder } from "./common.cjs";
export type MySqlYearBuilderInitial<TName extends string> = MySqlYearBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlYear';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>;
export declare class MySqlYearBuilder<T extends ColumnBuilderBaseConfig<'number', 'MySqlYear'>> extends MySqlColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class MySqlYear<T extends ColumnBaseConfig<'number', 'MySqlYear'>> extends MySqlColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function year(): MySqlYearBuilderInitial<''>;
export declare function year<TName extends string>(name: TName): MySqlYearBuilderInitial<TName>;
