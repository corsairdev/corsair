import type { ColumnBuilderBase, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnDataType, HasGenerated } from "../../column-builder.cjs";
import { ColumnBuilder } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { Column } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { Simplify, Update } from "../../utils.cjs";
import type { UpdateDeleteAction } from "../foreign-keys.cjs";
import type { AnyPgTable, PgTable } from "../table.cjs";
import type { SQL } from "../../sql/sql.cjs";
import type { PgIndexOpClass } from "../indexes.cjs";
export interface ReferenceConfig {
    ref: () => PgColumn;
    actions: {
        onUpdate?: UpdateDeleteAction;
        onDelete?: UpdateDeleteAction;
    };
}
export interface PgColumnBuilderBase<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TTypeConfig extends object = object> extends ColumnBuilderBase<T, TTypeConfig & {
    dialect: 'pg';
}> {
}
export declare abstract class PgColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TTypeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends ColumnBuilder<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'pg';
}, TExtraConfig> implements PgColumnBuilderBase<T, TTypeConfig> {
    private foreignKeyConfigs;
    static readonly [entityKind]: string;
    array<TSize extends number | undefined = undefined>(size?: TSize): PgArrayBuilder<{
        name: T['name'];
        dataType: 'array';
        columnType: 'PgArray';
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
export declare abstract class PgColumn<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = {}, TTypeConfig extends object = {}> extends Column<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'pg';
}> {
    readonly table: PgTable;
    static readonly [entityKind]: string;
    constructor(table: PgTable, config: ColumnBuilderRuntimeConfig<T['data'], TRuntimeConfig>);
}
export type IndexedExtraConfigType = {
    order?: 'asc' | 'desc';
    nulls?: 'first' | 'last';
    opClass?: string;
};
export declare class ExtraConfigColumn<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>> extends PgColumn<T, IndexedExtraConfigType> {
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
     * If you have the `pg_vector` extension installed in your database, you can use the
     * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
     *
     * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
     *
     * @param opClass
     * @returns
     */
    op(opClass: PgIndexOpClass): Omit<this, 'op'>;
}
export declare class IndexedColumn {
    static readonly [entityKind]: string;
    constructor(name: string | undefined, keyAsName: boolean, type: string, indexConfig: IndexedExtraConfigType);
    name: string | undefined;
    keyAsName: boolean;
    type: string;
    indexConfig: IndexedExtraConfigType;
}
export type AnyPgColumn<TPartial extends Partial<ColumnBaseConfig<ColumnDataType, string>> = {}> = PgColumn<Required<Update<ColumnBaseConfig<ColumnDataType, string>, TPartial>>>;
export type PgArrayColumnBuilderBaseConfig = ColumnBuilderBaseConfig<'array', 'PgArray'> & {
    size: number | undefined;
    baseBuilder: ColumnBuilderBaseConfig<ColumnDataType, string>;
};
export declare class PgArrayBuilder<T extends PgArrayColumnBuilderBaseConfig, TBase extends ColumnBuilderBaseConfig<ColumnDataType, string> | PgArrayColumnBuilderBaseConfig> extends PgColumnBuilder<T, {
    baseBuilder: TBase extends PgArrayColumnBuilderBaseConfig ? PgArrayBuilder<TBase, TBase extends {
        baseBuilder: infer TBaseBuilder extends ColumnBuilderBaseConfig<any, any>;
    } ? TBaseBuilder : never> : PgColumnBuilder<TBase, {}, Simplify<Omit<TBase, keyof ColumnBuilderBaseConfig<any, any>>>>;
    size: T['size'];
}, {
    baseBuilder: TBase extends PgArrayColumnBuilderBaseConfig ? PgArrayBuilder<TBase, TBase extends {
        baseBuilder: infer TBaseBuilder extends ColumnBuilderBaseConfig<any, any>;
    } ? TBaseBuilder : never> : PgColumnBuilder<TBase, {}, Simplify<Omit<TBase, keyof ColumnBuilderBaseConfig<any, any>>>>;
    size: T['size'];
}> {
    static readonly [entityKind] = "PgArrayBuilder";
    constructor(name: string, baseBuilder: PgArrayBuilder<T, TBase>['config']['baseBuilder'], size: T['size']);
}
export declare class PgArray<T extends ColumnBaseConfig<'array', 'PgArray'> & {
    size: number | undefined;
    baseBuilder: ColumnBuilderBaseConfig<ColumnDataType, string>;
}, TBase extends ColumnBuilderBaseConfig<ColumnDataType, string>> extends PgColumn<T, {}, {
    size: T['size'];
    baseBuilder: T['baseBuilder'];
}> {
    readonly baseColumn: PgColumn;
    readonly range?: [number | undefined, number | undefined] | undefined;
    readonly size: T['size'];
    static readonly [entityKind]: string;
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgArrayBuilder<T, TBase>['config'], baseColumn: PgColumn, range?: [number | undefined, number | undefined] | undefined);
    getSQLType(): string;
    mapFromDriverValue(value: unknown[] | string): T['data'];
    mapToDriverValue(value: unknown[], isNestedArray?: boolean): unknown[] | string;
}
