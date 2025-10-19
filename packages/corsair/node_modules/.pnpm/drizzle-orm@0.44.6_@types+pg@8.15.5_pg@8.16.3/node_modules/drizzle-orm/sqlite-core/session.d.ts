import { type Cache } from "../cache/core/cache.js";
import type { WithCacheConfig } from "../cache/core/types.js";
import { entityKind } from "../entity.js";
import { QueryPromise } from "../query-promise.js";
import type { TablesRelationalConfig } from "../relations.js";
import type { PreparedQuery } from "../session.js";
import type { Query, SQL } from "../sql/sql.js";
import type { SQLiteAsyncDialect, SQLiteSyncDialect } from "./dialect.js";
import { BaseSQLiteDatabase } from "./db.js";
import type { SQLiteRaw } from "./query-builders/raw.js";
import type { SelectedFieldsOrdered } from "./query-builders/select.types.js";
export interface PreparedQueryConfig {
    type: 'sync' | 'async';
    run: unknown;
    all: unknown;
    get: unknown;
    values: unknown;
    execute: unknown;
}
export declare class ExecuteResultSync<T> extends QueryPromise<T> {
    private resultCb;
    static readonly [entityKind]: string;
    constructor(resultCb: () => T);
    execute(): Promise<T>;
    sync(): T;
}
export type ExecuteResult<TType extends 'sync' | 'async', TResult> = TType extends 'async' ? Promise<TResult> : ExecuteResultSync<TResult>;
export declare abstract class SQLitePreparedQuery<T extends PreparedQueryConfig> implements PreparedQuery {
    private mode;
    private executeMethod;
    protected query: Query;
    private cache?;
    private queryMetadata?;
    private cacheConfig?;
    static readonly [entityKind]: string;
    constructor(mode: 'sync' | 'async', executeMethod: SQLiteExecuteMethod, query: Query, cache?: Cache | undefined, queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig?: WithCacheConfig | undefined);
    getQuery(): Query;
    abstract run(placeholderValues?: Record<string, unknown>): Result<T['type'], T['run']>;
    mapRunResult(result: unknown, _isFromBatch?: boolean): unknown;
    abstract all(placeholderValues?: Record<string, unknown>): Result<T['type'], T['all']>;
    mapAllResult(_result: unknown, _isFromBatch?: boolean): unknown;
    abstract get(placeholderValues?: Record<string, unknown>): Result<T['type'], T['get']>;
    mapGetResult(_result: unknown, _isFromBatch?: boolean): unknown;
    abstract values(placeholderValues?: Record<string, unknown>): Result<T['type'], T['values']>;
    execute(placeholderValues?: Record<string, unknown>): ExecuteResult<T['type'], T['execute']>;
    mapResult(response: unknown, isFromBatch?: boolean): unknown;
}
export interface SQLiteTransactionConfig {
    behavior?: 'deferred' | 'immediate' | 'exclusive';
}
export type SQLiteExecuteMethod = 'run' | 'all' | 'get';
export declare abstract class SQLiteSession<TResultKind extends 'sync' | 'async', TRunResult, TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> {
    static readonly [entityKind]: string;
    constructor(
    /** @internal */
    dialect: {
        sync: SQLiteSyncDialect;
        async: SQLiteAsyncDialect;
    }[TResultKind]);
    abstract prepareQuery(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => unknown, queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): SQLitePreparedQuery<PreparedQueryConfig & {
        type: TResultKind;
    }>;
    prepareOneTimeQuery(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => unknown, queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): SQLitePreparedQuery<PreparedQueryConfig & {
        type: TResultKind;
    }>;
    abstract transaction<T>(transaction: (tx: SQLiteTransaction<TResultKind, TRunResult, TFullSchema, TSchema>) => Result<TResultKind, T>, config?: SQLiteTransactionConfig): Result<TResultKind, T>;
    run(query: SQL): Result<TResultKind, TRunResult>;
    all<T = unknown>(query: SQL): Result<TResultKind, T[]>;
    get<T = unknown>(query: SQL): Result<TResultKind, T>;
    values<T extends any[] = unknown[]>(query: SQL): Result<TResultKind, T[]>;
    count(sql: SQL): Promise<number>;
}
export type Result<TKind extends 'sync' | 'async', TResult> = {
    sync: TResult;
    async: Promise<TResult>;
}[TKind];
export type DBResult<TKind extends 'sync' | 'async', TResult> = {
    sync: TResult;
    async: SQLiteRaw<TResult>;
}[TKind];
export declare abstract class SQLiteTransaction<TResultType extends 'sync' | 'async', TRunResult, TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends BaseSQLiteDatabase<TResultType, TRunResult, TFullSchema, TSchema> {
    protected schema: {
        fullSchema: Record<string, unknown>;
        schema: TSchema;
        tableNamesMap: Record<string, string>;
    } | undefined;
    protected readonly nestedIndex: number;
    static readonly [entityKind]: string;
    constructor(resultType: TResultType, dialect: {
        sync: SQLiteSyncDialect;
        async: SQLiteAsyncDialect;
    }[TResultType], session: SQLiteSession<TResultType, TRunResult, TFullSchema, TSchema>, schema: {
        fullSchema: Record<string, unknown>;
        schema: TSchema;
        tableNamesMap: Record<string, string>;
    } | undefined, nestedIndex?: number);
    rollback(): never;
}
