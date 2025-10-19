import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { PgColumn, PgColumnBuilder } from "./common.cjs";
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
