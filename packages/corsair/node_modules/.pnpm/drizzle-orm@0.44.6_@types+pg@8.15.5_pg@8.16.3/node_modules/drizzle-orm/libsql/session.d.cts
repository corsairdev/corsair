import type { Client, ResultSet, Transaction } from '@libsql/client';
import type { BatchItem as BatchItem } from "../batch.cjs";
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
export interface LibSQLSessionOptions {
    logger?: Logger;
    cache?: Cache;
}
type PreparedQueryConfig = Omit<PreparedQueryConfigBase, 'statement' | 'run'>;
export declare class LibSQLSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteSession<'async', ResultSet, TFullSchema, TSchema> {
    private client;
    private schema;
    private options;
    private tx;
    static readonly [entityKind]: string;
    private logger;
    private cache;
    constructor(client: Client, dialect: SQLiteAsyncDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options: LibSQLSessionOptions, tx: Transaction | undefined);
    prepareQuery<T extends Omit<PreparedQueryConfig, 'run'>>(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown, queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): LibSQLPreparedQuery<T>;
    batch<T extends BatchItem<'sqlite'>[] | readonly BatchItem<'sqlite'>[]>(queries: T): Promise<unknown[]>;
    migrate<T extends BatchItem<'sqlite'>[] | readonly BatchItem<'sqlite'>[]>(queries: T): Promise<unknown[]>;
    transaction<T>(transaction: (db: LibSQLTransaction<TFullSchema, TSchema>) => T | Promise<T>, _config?: SQLiteTransactionConfig): Promise<T>;
    extractRawAllValueFromBatchResult(result: unknown): unknown;
    extractRawGetValueFromBatchResult(result: unknown): unknown;
    extractRawValuesValueFromBatchResult(result: unknown): unknown;
}
export declare class LibSQLTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteTransaction<'async', ResultSet, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(transaction: (tx: LibSQLTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export declare class LibSQLPreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig> extends SQLitePreparedQuery<{
    type: 'async';
    run: ResultSet;
    all: T['all'];
    get: T['get'];
    values: T['values'];
    execute: T['execute'];
}> {
    private client;
    private logger;
    private tx;
    private _isResponseInArrayMode;
    static readonly [entityKind]: string;
    constructor(client: Client, query: Query, logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, 
    /** @internal */ fields: SelectedFieldsOrdered | undefined, tx: Transaction | undefined, executeMethod: SQLiteExecuteMethod, _isResponseInArrayMode: boolean, 
    /** @internal */ customResultMapper?: ((rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => unknown) | undefined);
    run(placeholderValues?: Record<string, unknown>): Promise<ResultSet>;
    all(placeholderValues?: Record<string, unknown>): Promise<T['all']>;
    mapAllResult(rows: unknown, isFromBatch?: boolean): unknown;
    get(placeholderValues?: Record<string, unknown>): Promise<T['get']>;
    mapGetResult(rows: unknown, isFromBatch?: boolean): unknown;
    values(placeholderValues?: Record<string, unknown>): Promise<T['values']>;
}
export {};
