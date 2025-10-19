import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
export type PgMacaddr8BuilderInitial<TName extends string> = PgMacaddr8Builder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgMacaddr8';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgMacaddr8Builder<T extends ColumnBuilderBaseConfig<'string', 'PgMacaddr8'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgMacaddr8<T extends ColumnBaseConfig<'string', 'PgMacaddr8'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function macaddr8(): PgMacaddr8BuilderInitial<''>;
export declare function macaddr8<TName extends string>(name: TName): PgMacaddr8BuilderInitial<TName>;
