import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { AnyGelTable } from "../table.cjs";
import { GelColumn, GelColumnBuilder } from "./common.cjs";
export type GelRealBuilderInitial<TName extends string> = GelRealBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'GelReal';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>;
export declare class GelRealBuilder<T extends ColumnBuilderBaseConfig<'number', 'GelReal'>> extends GelColumnBuilder<T, {
    length: number | undefined;
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], length?: number);
}
export declare class GelReal<T extends ColumnBaseConfig<'number', 'GelReal'>> extends GelColumn<T> {
    static readonly [entityKind]: string;
    constructor(table: AnyGelTable<{
        name: T['tableName'];
    }>, config: GelRealBuilder<T>['config']);
    getSQLType(): string;
}
export declare function real(): GelRealBuilderInitial<''>;
export declare function real<TName extends string>(name: TName): GelRealBuilderInitial<TName>;
