import type { ColumnBuilderBase, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnDataType, HasGenerated } from "../../column-builder.cjs";
import { ColumnBuilder } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { Column } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { Simplify, Update } from "../../utils.cjs";
import type { UpdateDeleteAction } from "../foreign-keys.cjs";
import type { AnyGelTable, GelTable } from "../table.cjs";
import type { SQL } from "../../sql/sql.cjs";
import type { GelIndexOpClass } from "../indexes.cjs";
export interface ReferenceConfig {
    ref: () => GelColumn;
    actions: {
        onUpdate?: UpdateDeleteAction;
        onDelete?: UpdateDeleteAction;
    };
}
export interface GelColumnBuilderBase<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TTypeConfig extends object = object> extends ColumnBuilderBase<T, TTypeConfig & {
    dialect: 'gel';
}> {
}
export declare abstract class GelColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TTypeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends ColumnBuilder<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'gel';
}, TExtraConfig> implements GelColumnBuilderBase<T, TTypeConfig> {
    private foreignKeyConfigs;
    static readonly [entityKind]: string;
    array<TSize extends number | undefined = undefined>(size?: TSize): GelArrayBuilder<{
        name: T['name'];
        dataType: 'array';
        columnType: 'GelArray';
        data: T['data'][];
        driverParam: T['driverParam'][] | string;
        enumValues: T['enumValues'];
        size: TSize;
        baseBuilder: T;
    } & (T extends {
        notNull: true;
    } ? {
        notNull: true;
    } : {}) & (T extends {
        hasDefault: true;
    } ? {
        hasDefault: true;
    } : {}), T>;
    references(ref: ReferenceConfig['ref'], actions?: ReferenceConfig['actions']): this;
    unique(name?: string, config?: {
        nulls: 'distinct' | 'not distinct';
    }): this;
    generatedAlwaysAs(as: SQL | T['data'] | (() => SQL)): HasGenerated<this, {
        type: 'always';
    }>;
}
export declare abstract class GelColumn<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = {}, TTypeConfig extends object = {}> extends Column<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'gel';
}> {
    readonly table: GelTable;
    static readonly [entityKind]: string;
    constructor(table: GelTable, config: ColumnBuilderRuntimeConfig<T['data'], TRuntimeConfig>);
}
export type IndexedExtraConfigType = {
    order?: 'asc' | 'desc';
    nulls?: 'first' | 'last';
    opClass?: string;
};
export declare class GelExtraConfigColumn<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>> extends GelColumn<T, IndexedExtraConfigType> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    indexConfig: IndexedExtraConfigType;
    defaultConfig: IndexedExtraConfigType;
    asc(): Omit<this, 'asc' | 'desc'>;
    desc(): Omit<this, 'asc' | 'desc'>;
    nullsFirst(): Omit<this, 'nullsFirst' | 'nullsLast'>;
    nullsLast(): Omit<this, 'nullsFirst' | 'nullsLast'>;
    /**
     * ### PostgreSQL documentation quote
     *
     * > An operator class with optional parameters can be specified for each column of an index.
     * The operator class identifies the operators to be used by the index for that column.
     * For example, a B-tree index on four-byte integers would use the int4_ops class;
     * this operator class includes comparison functions for four-byte integers.
     * In practice the default operator class for the column's data type is usually sufficient.
     * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
     * For example, we might want to sort a complex-number data type either by absolute value or by real part.
     * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
     * More information about operator classes check:
     *
     * ### Useful links
     * https://www.postgresql.org/docs/current/sql-createindex.html
     *
     * https://www.postgresql.org/docs/current/indexes-opclass.html
     *
     * https://www.postgresql.org/docs/current/xindex.html
     *
     * ### Additional types
     * If you have the `Gel_vector` extension installed in your database, you can use the
     * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
     *
     * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
     *
     * @param opClass
     * @returns
     */
    op(opClass: GelIndexOpClass): Omit<this, 'op'>;
}
export declare class IndexedColumn {
    static readonly [entityKind]: string;
    constructor(name: string | undefined, keyAsName: boolean, type: string, indexConfig: IndexedExtraConfigType);
    name: string | undefined;
    keyAsName: boolean;
    type: string;
    indexConfig: IndexedExtraConfigType;
}
export type AnyGelColumn<TPartial extends Partial<ColumnBaseConfig<ColumnDataType, string>> = {}> = GelColumn<Required<Update<ColumnBaseConfig<ColumnDataType, string>, TPartial>>>;
export type GelArrayColumnBuilderBaseConfig = ColumnBuilderBaseConfig<'array', 'GelArray'> & {
    size: number | undefined;
    baseBuilder: ColumnBuilderBaseConfig<ColumnDataType, string>;
};
export declare class GelArrayBuilder<T extends GelArrayColumnBuilderBaseConfig, TBase extends ColumnBuilderBaseConfig<ColumnDataType, string> | GelArrayColumnBuilderBaseConfig> extends GelColumnBuilder<T, {
    baseBuilder: TBase extends GelArrayColumnBuilderBaseConfig ? GelArrayBuilder<TBase, TBase extends {
        baseBuilder: infer TBaseBuilder extends ColumnBuilderBaseConfig<any, any>;
    } ? TBaseBuilder : never> : GelColumnBuilder<TBase, {}, Simplify<Omit<TBase, keyof ColumnBuilderBaseConfig<any, any>>>>;
    size: T['size'];
}, {
    baseBuilder: TBase extends GelArrayColumnBuilderBaseConfig ? GelArrayBuilder<TBase, TBase extends {
        baseBuilder: infer TBaseBuilder extends ColumnBuilderBaseConfig<any, any>;
    } ? TBaseBuilder : never> : GelColumnBuilder<TBase, {}, Simplify<Omit<TBase, keyof ColumnBuilderBaseConfig<any, any>>>>;
    size: T['size'];
}> {
    static readonly [entityKind] = "GelArrayBuilder";
    constructor(name: string, baseBuilder: GelArrayBuilder<T, TBase>['config']['baseBuilder'], size: T['size']);
}
export declare class GelArray<T extends ColumnBaseConfig<'array', 'GelArray'> & {
    size: number | undefined;
    baseBuilder: ColumnBuilderBaseConfig<ColumnDataType, string>;
}, TBase extends ColumnBuilderBaseConfig<ColumnDataType, string>> extends GelColumn<T, {}, {
    size: T['size'];
    baseBuilder: T['baseBuilder'];
}> {
    readonly baseColumn: GelColumn;
    readonly range?: [number | undefined, number | undefined] | undefined;
    readonly size: T['size'];
    static readonly [entityKind]: string;
    constructor(table: AnyGelTable<{
        name: T['tableName'];
    }>, config: GelArrayBuilder<T, TBase>['config'], baseColumn: GelColumn, range?: [number | undefined, number | undefined] | undefined);
    getSQLType(): string;
}
