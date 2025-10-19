import { type Cache } from "../cache/core/cache.js";
import type { WithCacheConfig } from "../cache/core/types.js";
import { entityKind } from "../entity.js";
import type { TablesRelationalConfig } from "../relations.js";
import type { PreparedQuery } from "../session.js";
import { type Query, type SQL } from "../sql/index.js";
import type { NeonAuthToken } from "../utils.js";
import { PgDatabase } from "./db.js";
import type { PgDialect } from "./dialect.js";
import type { SelectedFieldsOrdered } from "./query-builders/select.types.js";
export interface PreparedQueryConfig {
    execute: unknown;
    all: unknown;
    values: unknown;
}
export declare abstract class PgPreparedQuery<T extends PreparedQueryConfig> implements PreparedQuery {
    protected query: Query;
    private cache;
    private queryMetadata;
    private cacheConfig?;
    constructor(query: Query, cache: Cache | undefined, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig?: WithCacheConfig | undefined);
    protected authToken?: NeonAuthToken;
    getQuery(): Query;
    mapResult(response: unknown, _isFromBatch?: boolean): unknown;
    static readonly [entityKind]: string;
    abstract execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
}
export interface PgTransactionConfig {
    isolationLevel?: 'read uncommitted' | 'read committed' | 'repeatable read' | 'serializable';
    accessMode?: 'read only' | 'read write';
    deferrable?: boolean;
}
export declare abstract class PgSession<TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends TablesRelationalConfig = Record<string, never>> {
    protected dialect: PgDialect;
    static readonly [entityKind]: string;
    constructor(dialect: PgDialect);
    abstract prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => T['execute'], queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): PgPreparedQuery<T>;
    execute<T>(query: SQL): Promise<T>;
    all<T = unknown>(query: SQL): Promise<T[]>;
    count(sql: SQL): Promise<number>;
    abstract transaction<T>(transaction: (tx: PgTransaction<TQueryResult, TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T>;
}
export declare abstract class PgTransaction<TQueryResult extends PgQueryResultHKT, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends TablesRelationalConfig = Record<string, never>> extends PgDatabase<TQueryResult, TFullSchema, TSchema> {
    protected schema: {
        fullSchema: Record<string, unknown>;
        schema: TSchema;
        tableNamesMap: Record<string, string>;
    } | undefined;
    protected readonly nestedIndex: number;
    static readonly [entityKind]: string;
    constructor(dialect: PgDialect, session: PgSession<any, any, any>, schema: {
        fullSchema: Record<string, unknown>;
        schema: TSchema;
        tableNamesMap: Record<string, string>;
    } | undefined, nestedIndex?: number);
    rollback(): never;
    setTransaction(config: PgTransactionConfig): Promise<void>;
    abstract transaction<T>(transaction: (tx: PgTransaction<TQueryResult, TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface PgQueryResultHKT {
    readonly $brand: 'PgQueryResultHKT';
    readonly row: unknown;
    readonly type: unknown;
}
export type PgQueryResultKind<TKind extends PgQueryResultHKT, TRow> = (TKind & {
    readonly row: TRow;
})['type'];
