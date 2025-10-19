import { type AnyTable, type InferModelFromColumns, Table } from "./table.cjs";
import { type AnyColumn, Column } from "./column.cjs";
import { entityKind } from "./entity.cjs";
import { and, asc, between, desc, exists, ilike, inArray, isNotNull, isNull, like, not, notBetween, notExists, notIlike, notInArray, notLike, or } from "./sql/expressions/index.cjs";
import { type Placeholder, SQL, sql } from "./sql/sql.cjs";
import type { Assume, ColumnsWithTable, Equal, Simplify, ValueOrArray } from "./utils.cjs";
export declare abstract class Relation<TTableName extends string = string> {
    readonly sourceTable: Table;
    readonly referencedTable: AnyTable<{
        name: TTableName;
    }>;
    readonly relationName: string | undefined;
    static readonly [entityKind]: string;
    readonly $brand: 'Relation';
    readonly referencedTableName: TTableName;
    fieldName: string;
    constructor(sourceTable: Table, referencedTable: AnyTable<{
        name: TTableName;
    }>, relationName: string | undefined);
    abstract withFieldName(fieldName: string): Relation<TTableName>;
}
export declare class Relations<TTableName extends string = string, TConfig extends Record<string, Relation> = Record<string, Relation>> {
    readonly table: AnyTable<{
        name: TTableName;
    }>;
    readonly config: (helpers: TableRelationsHelpers<TTableName>) => TConfig;
    static readonly [entityKind]: string;
    readonly $brand: 'Relations';
    constructor(table: AnyTable<{
        name: TTableName;
    }>, config: (helpers: TableRelationsHelpers<TTableName>) => TConfig);
}
export declare class One<TTableName extends string = string, TIsNullable extends boolean = boolean> extends Relation<TTableName> {
    readonly config: RelationConfig<TTableName, string, AnyColumn<{
        tableName: TTableName;
    }>[]> | undefined;
    readonly isNullable: TIsNullable;
    static readonly [entityKind]: string;
    protected $relationBrand: 'One';
    constructor(sourceTable: Table, referencedTable: AnyTable<{
        name: TTableName;
    }>, config: RelationConfig<TTableName, string, AnyColumn<{
        tableName: TTableName;
    }>[]> | undefined, isNullable: TIsNullable);
    withFieldName(fieldName: string): One<TTableName>;
}
export declare class Many<TTableName extends string> extends Relation<TTableName> {
    readonly config: {
        relationName: string;
    } | undefined;
    static readonly [entityKind]: string;
    protected $relationBrand: 'Many';
    constructor(sourceTable: Table, referencedTable: AnyTable<{
        name: TTableName;
    }>, config: {
        relationName: string;
    } | undefined);
    withFieldName(fieldName: string): Many<TTableName>;
}
export type TableRelationsKeysOnly<TSchema extends Record<string, unknown>, TTableName extends string, K extends keyof TSchema> = TSchema[K] extends Relations<TTableName> ? K : never;
export type ExtractTableRelationsFromSchema<TSchema extends Record<string, unknown>, TTableName extends string> = ExtractObjectValues<{
    [K in keyof TSchema as TableRelationsKeysOnly<TSchema, TTableName, K>]: TSchema[K] extends Relations<TTableName, infer TConfig> ? TConfig : never;
}>;
export type ExtractObjectValues<T> = T[keyof T];
export type ExtractRelationsFromTableExtraConfigSchema<TConfig extends unknown[]> = ExtractObjectValues<{
    [K in keyof TConfig as TConfig[K] extends Relations<any> ? K : never]: TConfig[K] extends Relations<infer TRelationConfig> ? TRelationConfig : never;
}>;
export declare function getOperators(): {
    and: typeof and;
    between: typeof between;
    eq: import("./index.ts").BinaryOperator;
    exists: typeof exists;
    gt: import("./index.ts").BinaryOperator;
    gte: import("./index.ts").BinaryOperator;
    ilike: typeof ilike;
    inArray: typeof inArray;
    isNull: typeof isNull;
    isNotNull: typeof isNotNull;
    like: typeof like;
    lt: import("./index.ts").BinaryOperator;
    lte: import("./index.ts").BinaryOperator;
    ne: import("./index.ts").BinaryOperator;
    not: typeof not;
    notBetween: typeof notBetween;
    notExists: typeof notExists;
    notLike: typeof notLike;
    notIlike: typeof notIlike;
    notInArray: typeof notInArray;
    or: typeof or;
    sql: typeof sql;
};
export type Operators = ReturnType<typeof getOperators>;
export declare function getOrderByOperators(): {
    sql: typeof sql;
    asc: typeof asc;
    desc: typeof desc;
};
export type OrderByOperators = ReturnType<typeof getOrderByOperators>;
export type FindTableByDBName<TSchema extends TablesRelationalConfig, TTableName extends string> = ExtractObjectValues<{
    [K in keyof TSchema as TSchema[K]['dbName'] extends TTableName ? K : never]: TSchema[K];
}>;
export type DBQueryConfig<TRelationType extends 'one' | 'many' = 'one' | 'many', TIsRoot extends boolean = boolean, TSchema extends TablesRelationalConfig = TablesRelationalConfig, TTableConfig extends TableRelationalConfig = TableRelationalConfig> = {
    columns?: {
        [K in keyof TTableConfig['columns']]?: boolean;
    } | undefined;
    with?: {
        [K in keyof TTableConfig['relations']]?: true | DBQueryConfig<TTableConfig['relations'][K] extends One ? 'one' : 'many', false, TSchema, FindTableByDBName<TSchema, TTableConfig['relations'][K]['referencedTableName']>> | undefined;
    } | undefined;
    extras?: Record<string, SQL.Aliased> | ((fields: Simplify<[
        TTableConfig['columns']
    ] extends [never] ? {} : TTableConfig['columns']>, operators: {
        sql: Operators['sql'];
    }) => Record<string, SQL.Aliased>) | undefined;
} & (TRelationType extends 'many' ? {
    where?: SQL | undefined | ((fields: Simplify<[
        TTableConfig['columns']
    ] extends [never] ? {} : TTableConfig['columns']>, operators: Operators) => SQL | undefined);
    orderBy?: ValueOrArray<AnyColumn | SQL> | ((fields: Simplify<[
        TTableConfig['columns']
    ] extends [never] ? {} : TTableConfig['columns']>, operators: OrderByOperators) => ValueOrArray<AnyColumn | SQL>) | undefined;
    limit?: number | Placeholder | undefined;
} & (TIsRoot extends true ? {
    offset?: number | Placeholder | undefined;
} : {}) : {});
export interface TableRelationalConfig {
    tsName: string;
    dbName: string;
    columns: Record<string, Column>;
    relations: Record<string, Relation>;
    primaryKey: AnyColumn[];
    schema?: string;
}
export type TablesRelationalConfig = Record<string, TableRelationalConfig>;
export interface RelationalSchemaConfig<TSchema extends TablesRelationalConfig> {
    fullSchema: Record<string, unknown>;
    schema: TSchema;
    tableNamesMap: Record<string, string>;
}
export type ExtractTablesWithRelations<TSchema extends Record<string, unknown>> = {
    [K in keyof TSchema as TSchema[K] extends Table ? K : never]: TSchema[K] extends Table ? {
        tsName: K & string;
        dbName: TSchema[K]['_']['name'];
        columns: TSchema[K]['_']['columns'];
        relations: ExtractTableRelationsFromSchema<TSchema, TSchema[K]['_']['name']>;
        primaryKey: AnyColumn[];
    } : never;
};
export type ReturnTypeOrValue<T> = T extends (...args: any[]) => infer R ? R : T;
export type BuildRelationResult<TSchema extends TablesRelationalConfig, TInclude, TRelations extends Record<string, Relation>> = {
    [K in NonUndefinedKeysOnly<TInclude> & keyof TRelations]: TRelations[K] extends infer TRel extends Relation ? BuildQueryResult<TSchema, FindTableByDBName<TSchema, TRel['referencedTableName']>, Assume<TInclude[K], true | Record<string, unknown>>> extends infer TResult ? TRel extends One ? TResult | (Equal<TRel['isNullable'], false> extends true ? null : never) : TResult[] : never : never;
};
export type NonUndefinedKeysOnly<T> = ExtractObjectValues<{
    [K in keyof T as T[K] extends undefined ? never : K]: K;
}> & keyof T;
export type BuildQueryResult<TSchema extends TablesRelationalConfig, TTableConfig extends TableRelationalConfig, TFullSelection extends true | Record<string, unknown>> = Equal<TFullSelection, true> extends true ? InferModelFromColumns<TTableConfig['columns']> : TFullSelection extends Record<string, unknown> ? Simplify<(TFullSelection['columns'] extends Record<string, unknown> ? InferModelFromColumns<{
    [K in Equal<Exclude<TFullSelection['columns'][keyof TFullSelection['columns'] & keyof TTableConfig['columns']], undefined>, false> extends true ? Exclude<keyof TTableConfig['columns'], NonUndefinedKeysOnly<TFullSelection['columns']>> : {
        [K in keyof TFullSelection['columns']]: Equal<TFullSelection['columns'][K], true> extends true ? K : never;
    }[keyof TFullSelection['columns']] & keyof TTableConfig['columns']]: TTableConfig['columns'][K];
}> : InferModelFromColumns<TTableConfig['columns']>) & (TFullSelection['extras'] extends Record<string, unknown> | ((...args: any[]) => Record<string, unknown>) ? {
    [K in NonUndefinedKeysOnly<ReturnTypeOrValue<TFullSelection['extras']>>]: Assume<ReturnTypeOrValue<TFullSelection['extras']>[K], SQL.Aliased>['_']['type'];
} : {}) & (TFullSelection['with'] extends Record<string, unknown> ? BuildRelationResult<TSchema, TFullSelection['with'], TTableConfig['relations']> : {})> : never;
export interface RelationConfig<TTableName extends string, TForeignTableName extends string, TColumns extends AnyColumn<{
    tableName: TTableName;
}>[]> {
    relationName?: string;
    fields: TColumns;
    references: ColumnsWithTable<TTableName, TForeignTableName, TColumns>;
}
export declare function extractTablesRelationalConfig<TTables extends TablesRelationalConfig>(schema: Record<string, unknown>, configHelpers: (table: Table) => any): {
    tables: TTables;
    tableNamesMap: Record<string, string>;
};
export declare function relations<TTableName extends string, TRelations extends Record<string, Relation<any>>>(table: AnyTable<{
    name: TTableName;
}>, relations: (helpers: TableRelationsHelpers<TTableName>) => TRelations): Relations<TTableName, TRelations>;
export declare function createOne<TTableName extends string>(sourceTable: Table): <TForeignTable extends Table, TColumns extends [AnyColumn<{
    tableName: TTableName;
}>, ...AnyColumn<{
    tableName: TTableName;
}>[]]>(table: TForeignTable, config?: RelationConfig<TTableName, TForeignTable["_"]["name"], TColumns>) => One<TForeignTable["_"]["name"], Equal<TColumns[number]["_"]["notNull"], true>>;
export declare function createMany(sourceTable: Table): <TForeignTable extends Table>(referencedTable: TForeignTable, config?: {
    relationName: string;
}) => Many<TForeignTable["_"]["name"]>;
export interface NormalizedRelation {
    fields: AnyColumn[];
    references: AnyColumn[];
}
export declare function normalizeRelation(schema: TablesRelationalConfig, tableNamesMap: Record<string, string>, relation: Relation): NormalizedRelation;
export declare function createTableRelationsHelpers<TTableName extends string>(sourceTable: AnyTable<{
    name: TTableName;
}>): {
    one: <TForeignTable extends Table, TColumns extends [AnyColumn<{
        tableName: TTableName;
    }>, ...AnyColumn<{
        tableName: TTableName;
    }>[]]>(table: TForeignTable, config?: RelationConfig<TTableName, TForeignTable["_"]["name"], TColumns> | undefined) => One<TForeignTable["_"]["name"], Equal<TColumns[number]["_"]["notNull"], true>>;
    many: <TForeignTable extends Table>(referencedTable: TForeignTable, config?: {
        relationName: string;
    }) => Many<TForeignTable["_"]["name"]>;
};
export type TableRelationsHelpers<TTableName extends string> = ReturnType<typeof createTableRelationsHelpers<TTableName>>;
export interface BuildRelationalQueryResult<TTable extends Table = Table, TColumn extends Column = Column> {
    tableTsKey: string;
    selection: {
        dbKey: string;
        tsKey: string;
        field: TColumn | SQL | SQL.Aliased;
        relationTableTsKey: string | undefined;
        isJson: boolean;
        isExtra?: boolean;
        selection: BuildRelationalQueryResult<TTable>['selection'];
    }[];
    sql: TTable | SQL;
}
export declare function mapRelationalRow(tablesConfig: TablesRelationalConfig, tableConfig: TableRelationalConfig, row: unknown[], buildQueryResultSelection: BuildRelationalQueryResult['selection'], mapColumnValue?: (value: unknown) => unknown): Record<string, unknown>;
