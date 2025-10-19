import type { ColumnBuilderBaseConfig, HasDefault, IsAutoincrement, IsPrimaryKey, NotNull } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.cjs";
export type MySqlSerialBuilderInitial<TName extends string> = IsAutoincrement<IsPrimaryKey<NotNull<HasDefault<MySqlSerialBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlSerial';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>>>>>;
export declare class MySqlSerialBuilder<T extends ColumnBuilderBaseConfig<'number', 'MySqlSerial'>> extends MySqlColumnBuilderWithAutoIncrement<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class MySqlSerial<T extends ColumnBaseConfig<'number', 'MySqlSerial'>> extends MySqlColumnWithAutoIncrement<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function serial(): MySqlSerialBuilderInitial<''>;
export declare function serial<TName extends string>(name: TName): MySqlSerialBuilderInitial<TName>;
