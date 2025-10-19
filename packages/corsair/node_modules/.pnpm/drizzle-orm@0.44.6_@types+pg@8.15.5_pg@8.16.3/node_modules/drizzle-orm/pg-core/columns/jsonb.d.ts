import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import type { AnyPgTable } from "../table.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
export type PgJsonbBuilderInitial<TName extends string> = PgJsonbBuilder<{
    name: TName;
    dataType: 'json';
    columnType: 'PgJsonb';
    data: unknown;
    driverParam: unknown;
    enumValues: undefined;
}>;
export declare class PgJsonbBuilder<T extends ColumnBuilderBaseConfig<'json', 'PgJsonb'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgJsonb<T extends ColumnBaseConfig<'json', 'PgJsonb'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgJsonbBuilder<T>['config']);
    getSQLType(): string;
    mapToDriverValue(value: T['data']): string;
    mapFromDriverValue(value: T['data'] | string): T['data'];
}
export declare function jsonb(): PgJsonbBuilderInitial<''>;
export declare function jsonb<TName extends string>(name: TName): PgJsonbBuilderInitial<TName>;
