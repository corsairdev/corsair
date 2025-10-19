import type { BatchItem } from "../batch.cjs";
import { type Cache } from "../cache/core/index.cjs";
import type { WithCacheConfig } from "../cache/core/types.cjs";
import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.cjs";
import { type Query } from "../sql/sql.cjs";
import type { SQLiteAsyncDialect } from "../sqlite-core/dialect.cjs";
import { SQLiteTransaction } from "../sqlite-core/index.cjs";
import type { SelectedFieldsOrdered } from "../sqlite-core/query-builders/select.types.cjs";
import type { PreparedQueryConfig as PreparedQueryConfigBase, SQLiteExecuteMethod, SQLiteTransactionConfig } from "../sqlite-core/session.cjs";
import { SQLitePreparedQuery, SQLiteSession } from "../sqlite-core/session.cjs";
export interface SQLiteD1SessionOptions {
    logger?: Logger;
    cache?: Cache;
}
type PreparedQueryConfig = Omit<PreparedQueryConfigBase, 'statement' | 'run'>;
export declare class SQLiteD1Session<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteSession<'async', D1Result, TFullSchema, TSchema> {
    private client;
    private schema;
    private options;
    static readonly [entityKind]: string;
    private logger;
    private cache;
    constructor(client: D1Database, dialect: SQLiteAsyncDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: SQLiteD1SessionOptions);
    prepareQuery(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown, queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): D1PreparedQuery;
    batch<T extends BatchItem<'sqlite'>[] | readonly BatchItem<'sqlite'>[]>(queries: T): Promise<unknown[]>;
    extractRawAllValueFromBatchResult(result: unknown): unknown;
    extractRawGetValueFromBatchResult(result: unknown): unknown;
    extractRawValuesValueFromBatchResult(result: unknown): unknown;
    transaction<T>(transaction: (tx: D1Transaction<TFullSchema, TSchema>) => T | Promise<T>, config?: SQLiteTransactionConfig): Promise<T>;
}
export declare class D1Transaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteTransaction<'async', D1Result, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(transaction: (tx: D1Transaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export declare class D1PreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig> extends SQLitePreparedQuery<{
    type: 'async';
    run: D1Response;
    all: T['all'];
    get: T['get'];
    values: T['values'];
    execute: T['execute'];
}> {
    private logger;
    private _isResponseInArrayMode;
    static readonly [entityKind]: string;
    constructor(stmt: D1PreparedStatement, query: Query, logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, _isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown);
    run(placeholderValues?: Record<string, unknown>): Promise<D1Response>;
    all(placeholderValues?: Record<string, unknown>): Promise<T['all']>;
    mapAllResult(rows: unknown, isFromBatch?: boolean): unknown;
    get(placeholderValues?: Record<string, unknown>): Promise<T['get']>;
    mapGetResult(result: unknown, isFromBatch?: boolean): unknown;
    values<T extends any[] = unknown[]>(placeholderValues?: Record<string, unknown>): Promise<T[]>;
}
export {};
