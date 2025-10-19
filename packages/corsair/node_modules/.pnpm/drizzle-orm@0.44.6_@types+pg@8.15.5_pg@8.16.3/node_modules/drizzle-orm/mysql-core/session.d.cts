import { type Cache } from "../cache/core/cache.cjs";
import type { WithCacheConfig } from "../cache/core/types.cjs";
import { entityKind } from "../entity.cjs";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.cjs";
import { type Query, type SQL } from "../sql/sql.cjs";
import type { Assume, Equal } from "../utils.cjs";
import { MySqlDatabase } from "./db.cjs";
import type { MySqlDialect } from "./dialect.cjs";
import type { SelectedFieldsOrdered } from "./query-builders/select.types.cjs";
export type Mode = 'default' | 'planetscale';
export interface MySqlQueryResultHKT {
    readonly $brand: 'MySqlQueryResultHKT';
    readonly row: unknown;
    readonly type: unknown;
}
export interface AnyMySqlQueryResultHKT extends MySqlQueryResultHKT {
    readonly type: any;
}
export type MySqlQueryResultKind<TKind extends MySqlQueryResultHKT, TRow> = (TKind & {
    readonly row: TRow;
})['type'];
export interface MySqlPreparedQueryConfig {
    execute: unknown;
    iterator: unknown;
}
export interface MySqlPreparedQueryHKT {
    readonly $brand: 'MySqlPreparedQueryHKT';
    readonly config: unknown;
    readonly type: unknown;
}
export type PreparedQueryKind<TKind extends MySqlPreparedQueryHKT, TConfig extends MySqlPreparedQueryConfig, TAssume extends boolean = false> = Equal<TAssume, true> extends true ? Assume<(TKind & {
    readonly config: TConfig;
})['type'], MySqlPreparedQuery<TConfig>> : (TKind & {
    readonly config: TConfig;
})['type'];
export declare abstract class MySqlPreparedQuery<T extends MySqlPreparedQueryConfig> {
    private cache;
    private queryMetadata;
    private cacheConfig?;
    static readonly [entityKind]: string;
    constructor(// cache instance
    cache: Cache | undefined, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig?: WithCacheConfig | undefined);
    abstract execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
    abstract iterator(placeholderValues?: Record<string, unknown>): AsyncGenerator<T['iterator']>;
}
export interface MySqlTransactionConfig {
    withConsistentSnapshot?: boolean;
    accessMode?: 'read only' | 'read write';
    isolationLevel: 'read uncommitted' | 'read committed' | 'repeatable read' | 'serializable';
}
export declare abstract class MySqlSession<TQueryResult extends MySqlQueryResultHKT = MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends TablesRelationalConfig = Record<string, never>> {
    protected dialect: MySqlDialect;
    static readonly [entityKind]: string;
    constructor(dialect: MySqlDialect);
    abstract prepareQuery<T extends MySqlPreparedQueryConfig, TPreparedQueryHKT extends MySqlPreparedQueryHKT>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered, queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): PreparedQueryKind<TPreparedQueryHKT, T>;
    execute<T>(query: SQL): Promise<T>;
    abstract all<T = unknown>(query: SQL): Promise<T[]>;
    count(sql: SQL): Promise<number>;
    abstract transaction<T>(transaction: (tx: MySqlTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TSchema>) => Promise<T>, config?: MySqlTransactionConfig): Promise<T>;
    protected getSetTransactionSQL(config: MySqlTransactionConfig): SQL | undefined;
    protected getStartTransactionSQL(config: MySqlTransactionConfig): SQL | undefined;
}
export declare abstract class MySqlTransaction<TQueryResult extends MySqlQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends TablesRelationalConfig = Record<string, never>> extends MySqlDatabase<TQueryResult, TPreparedQueryHKT, TFullSchema, TSchema> {
    protected schema: RelationalSchemaConfig<TSchema> | undefined;
    protected readonly nestedIndex: number;
    static readonly [entityKind]: string;
    constructor(dialect: MySqlDialect, session: MySqlSession, schema: RelationalSchemaConfig<TSchema> | undefined, nestedIndex: number, mode: Mode);
    rollback(): never;
    /** Nested transactions (aka savepoints) only work with InnoDB engine. */
    abstract transaction<T>(transaction: (tx: MySqlTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface PreparedQueryHKTBase extends MySqlPreparedQueryHKT {
    type: MySqlPreparedQuery<Assume<this['config'], MySqlPreparedQueryConfig>>;
}
