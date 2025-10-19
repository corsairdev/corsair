import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
export type PgInetBuilderInitial<TName extends string> = PgInetBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgInet';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgInetBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgInet'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgInet<T extends ColumnBaseConfig<'string', 'PgInet'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function inet(): PgInetBuilderInitial<''>;
export declare function inet<TName extends string>(name: TName): PgInetBuilderInitial<TName>;
