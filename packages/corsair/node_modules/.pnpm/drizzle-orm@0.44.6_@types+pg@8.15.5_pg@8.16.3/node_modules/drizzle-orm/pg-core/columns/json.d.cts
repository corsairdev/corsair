import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { AnyPgTable } from "../table.cjs";
import { PgColumn, PgColumnBuilder } from "./common.cjs";
export type PgJsonBuilderInitial<TName extends string> = PgJsonBuilder<{
    name: TName;
    dataType: 'json';
    columnType: 'PgJson';
    data: unknown;
    driverParam: unknown;
    enumValues: undefined;
}>;
export declare class PgJsonBuilder<T extends ColumnBuilderBaseConfig<'json', 'PgJson'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgJson<T extends ColumnBaseConfig<'json', 'PgJson'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgJsonBuilder<T>['config']);
    getSQLType(): string;
    mapToDriverValue(value: T['data']): string;
    mapFromDriverValue(value: T['data'] | string): T['data'];
}
export declare function json(): PgJsonBuilderInitial<''>;
export declare function json<TName extends string>(name: TName): PgJsonBuilderInitial<TName>;
