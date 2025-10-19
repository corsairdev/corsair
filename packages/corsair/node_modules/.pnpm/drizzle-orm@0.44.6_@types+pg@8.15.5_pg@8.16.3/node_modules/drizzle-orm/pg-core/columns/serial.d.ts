import type { ColumnBuilderBaseConfig, HasDefault, NotNull } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
export type PgSerialBuilderInitial<TName extends string> = NotNull<HasDefault<PgSerialBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'PgSerial';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>>>;
export declare class PgSerialBuilder<T extends ColumnBuilderBaseConfig<'number', 'PgSerial'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgSerial<T extends ColumnBaseConfig<'number', 'PgSerial'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function serial(): PgSerialBuilderInitial<''>;
export declare function serial<TName extends string>(name: TName): PgSerialBuilderInitial<TName>;
