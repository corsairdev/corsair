import type { ColumnBuilderBaseConfig, HasDefault, IsAutoincrement, IsPrimaryKey, NotNull } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
export type SingleStoreSerialBuilderInitial<TName extends string> = IsAutoincrement<IsPrimaryKey<NotNull<HasDefault<SingleStoreSerialBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SingleStoreSerial';
    data: number;
    driverParam: number;
    enumValues: undefined;
    generated: undefined;
}>>>>>;
export declare class SingleStoreSerialBuilder<T extends ColumnBuilderBaseConfig<'number', 'SingleStoreSerial'>> extends SingleStoreColumnBuilderWithAutoIncrement<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SingleStoreSerial<T extends ColumnBaseConfig<'number', 'SingleStoreSerial'>> extends SingleStoreColumnWithAutoIncrement<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function serial(): SingleStoreSerialBuilderInitial<''>;
export declare function serial<TName extends string>(name: TName): SingleStoreSerialBuilderInitial<TName>;
