import { type Cache } from "../cache/core/cache.js";
import type { WithCacheConfig } from "../cache/core/types.js";
import { entityKind } from "../entity.js";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.js";
import { type Query, type SQL } from "../sql/sql.js";
import type { Assume, Equal } from "../utils.js";
import { SingleStoreDatabase } from "./db.js";
import type { SingleStoreDialect } from "./dialect.js";
import type { SelectedFieldsOrdered } from "./query-builders/select.types.js";
export interface SingleStoreQueryResultHKT {
    readonly $brand: 'SingleStoreQueryResultHKT';
    readonly row: unknown;
    readonly type: unknown;
}
export interface AnySingleStoreQueryResultHKT extends SingleStoreQueryResultHKT {
    readonly type: any;
}
export type SingleStoreQueryResultKind<TKind extends SingleStoreQueryResultHKT, TRow> = (TKind & {
    readonly row: TRow;
})['type'];
export interface SingleStorePreparedQueryConfig {
    execute: unknown;
    iterator: unknown;
}
export interface SingleStorePreparedQueryHKT {
    readonly $brand: 'SingleStorePreparedQueryHKT';
    readonly config: unknown;
    readonly type: unknown;
}
export type PreparedQueryKind<TKind extends SingleStorePreparedQueryHKT, TConfig extends SingleStorePreparedQueryConfig, TAssume extends boolean = false> = Equal<TAssume, true> extends true ? Assume<(TKind & {
    readonly config: TConfig;
})['type'], SingleStorePreparedQuery<TConfig>> : (TKind & {
    readonly config: TConfig;
})['type'];
export declare abstract class SingleStorePreparedQuery<T extends SingleStorePreparedQueryConfig> {
    private cache?;
    private queryMetadata?;
    private cacheConfig?;
    static readonly [entityKind]: string;
    constructor(cache?: Cache | undefined, queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig?: WithCacheConfig | undefined);
    abstract execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
    abstract iterator(placeholderValues?: Record<string, unknown>): AsyncGenerator<T['iterator']>;
}
export interface SingleStoreTransactionConfig {
    withConsistentSnapshot?: boolean;
    accessMode?: 'read only' | 'read write';
    isolationLevel: 'read committed';
}
export declare abstract class SingleStoreSession<TQueryResult extends SingleStoreQueryResultHKT = SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends TablesRelationalConfig = Record<string, never>> {
    protected dialect: SingleStoreDialect;
    static readonly [entityKind]: string;
    constructor(dialect: SingleStoreDialect);
    abstract prepareQuery<T extends SingleStorePreparedQueryConfig, TPreparedQueryHKT extends SingleStorePreparedQueryHKT>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered, queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): PreparedQueryKind<TPreparedQueryHKT, T>;
    execute<T>(query: SQL): Promise<T>;
    abstract all<T = unknown>(query: SQL): Promise<T[]>;
    count(sql: SQL): Promise<number>;
    abstract transaction<T>(transaction: (tx: SingleStoreTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TSchema>) => Promise<T>, config?: SingleStoreTransactionConfig): Promise<T>;
    protected getSetTransactionSQL(config: SingleStoreTransactionConfig): SQL | undefined;
    protected getStartTransactionSQL(config: SingleStoreTransactionConfig): SQL | undefined;
}
export declare abstract class SingleStoreTransaction<TQueryResult extends SingleStoreQueryResultHKT, TPreparedQueryHKT extends PreparedQueryHKTBase, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends TablesRelationalConfig = Record<string, never>> extends SingleStoreDatabase<TQueryResult, TPreparedQueryHKT, TFullSchema, TSchema> {
    protected schema: RelationalSchemaConfig<TSchema> | undefined;
    protected readonly nestedIndex: number;
    static readonly [entityKind]: string;
    constructor(dialect: SingleStoreDialect, session: SingleStoreSession, schema: RelationalSchemaConfig<TSchema> | undefined, nestedIndex: number);
    rollback(): never;
    /** Nested transactions (aka savepoints) only work with InnoDB engine. */
    abstract transaction<T>(transaction: (tx: SingleStoreTransaction<TQueryResult, TPreparedQueryHKT, TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface PreparedQueryHKTBase extends SingleStorePreparedQueryHKT {
    type: SingleStorePreparedQuery<Assume<this['config'], SingleStorePreparedQueryConfig>>;
}
