import type { ColumnBuilderBaseConfig, HasDefault, NotNull } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { PgColumn, PgColumnBuilder } from "./common.cjs";
export type PgSmallSerialBuilderInitial<TName extends string> = NotNull<HasDefault<PgSmallSerialBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'PgSmallSerial';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>>>;
export declare class PgSmallSerialBuilder<T extends ColumnBuilderBaseConfig<'number', 'PgSmallSerial'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgSmallSerial<T extends ColumnBaseConfig<'number', 'PgSmallSerial'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function smallserial(): PgSmallSerialBuilderInitial<''>;
export declare function smallserial<TName extends string>(name: TName): PgSmallSerialBuilderInitial<TName>;
