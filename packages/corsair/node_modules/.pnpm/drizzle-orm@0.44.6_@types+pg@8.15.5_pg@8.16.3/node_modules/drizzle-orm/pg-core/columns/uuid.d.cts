import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { PgColumn, PgColumnBuilder } from "./common.cjs";
export type PgUUIDBuilderInitial<TName extends string> = PgUUIDBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgUUID';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgUUIDBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgUUID'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
    /**
     * Adds `default gen_random_uuid()` to the column definition.
     */
    defaultRandom(): ReturnType<this['default']>;
}
export declare class PgUUID<T extends ColumnBaseConfig<'string', 'PgUUID'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function uuid(): PgUUIDBuilderInitial<''>;
export declare function uuid<TName extends string>(name: TName): PgUUIDBuilderInitial<TName>;
