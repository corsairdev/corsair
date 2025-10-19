import type { BatchItem } from "../batch.js";
import { type Cache } from "../cache/core/index.js";
import type { WithCacheConfig } from "../cache/core/types.js";
import { entityKind } from "../entity.js";
import type { Logger } from "../logger.js";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.js";
import { type Query } from "../sql/sql.js";
import type { SQLiteAsyncDialect } from "../sqlite-core/dialect.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import type { SelectedFieldsOrdered } from "../sqlite-core/query-builders/select.types.js";
import type { PreparedQueryConfig as PreparedQueryConfigBase, SQLiteExecuteMethod, SQLiteTransactionConfig } from "../sqlite-core/session.js";
import { SQLitePreparedQuery, SQLiteSession } from "../sqlite-core/session.js";
import type { AsyncBatchRemoteCallback, RemoteCallback, SqliteRemoteResult } from "./driver.js";
export interface SQLiteRemoteSessionOptions {
    logger?: Logger;
    cache?: Cache;
}
export type PreparedQueryConfig = Omit<PreparedQueryConfigBase, 'statement' | 'run'>;
export declare class SQLiteRemoteSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteSession<'async', SqliteRemoteResult, TFullSchema, TSchema> {
    private client;
    private schema;
    private batchCLient?;
    static readonly [entityKind]: string;
    private logger;
    private cache;
    constructor(client: RemoteCallback, dialect: SQLiteAsyncDialect, schema: RelationalSchemaConfig<TSchema> | undefined, batchCLient?: AsyncBatchRemoteCallback | undefined, options?: SQLiteRemoteSessionOptions);
    prepareQuery<T extends Omit<PreparedQueryConfig, 'run'>>(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown, queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): RemotePreparedQuery<T>;
    batch<T extends BatchItem<'sqlite'>[] | readonly BatchItem<'sqlite'>[]>(queries: T): Promise<unknown[]>;
    transaction<T>(transaction: (tx: SQLiteProxyTransaction<TFullSchema, TSchema>) => Promise<T>, config?: SQLiteTransactionConfig): Promise<T>;
    extractRawAllValueFromBatchResult(result: unknown): unknown;
    extractRawGetValueFromBatchResult(result: unknown): unknown;
    extractRawValuesValueFromBatchResult(result: unknown): unknown;
}
export declare class SQLiteProxyTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteTransaction<'async', SqliteRemoteResult, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(transaction: (tx: SQLiteProxyTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export declare class RemotePreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig> extends SQLitePreparedQuery<{
    type: 'async';
    run: SqliteRemoteResult;
    all: T['all'];
    get: T['get'];
    values: T['values'];
    execute: T['execute'];
}> {
    private client;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    static readonly [entityKind]: string;
    private method;
    constructor(client: RemoteCallback, query: Query, logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, _isResponseInArrayMode: boolean, 
    /** @internal */ customResultMapper?: ((rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => unknown) | undefined);
    getQuery(): Query & {
        method: SQLiteExecuteMethod;
    };
    run(placeholderValues?: Record<string, unknown>): Promise<SqliteRemoteResult>;
    mapAllResult(rows: unknown, isFromBatch?: boolean): unknown;
    all(placeholderValues?: Record<string, unknown>): Promise<T['all']>;
    get(placeholderValues?: Record<string, unknown>): Promise<T['get']>;
    mapGetResult(rows: unknown, isFromBatch?: boolean): unknown;
    values<T extends any[] = unknown[]>(placeholderValues?: Record<string, unknown>): Promise<T[]>;
}
