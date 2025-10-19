import { type Client, Pool, type PoolClient, type QueryResult, type QueryResultRow } from '@neondatabase/serverless';
import { type Cache } from "../cache/core/cache.js";
import type { WithCacheConfig } from "../cache/core/types.js";
import { entityKind } from "../entity.js";
import type { Logger } from "../logger.js";
import type { PgDialect } from "../pg-core/dialect.js";
import { PgTransaction } from "../pg-core/index.js";
import type { SelectedFieldsOrdered } from "../pg-core/query-builders/select.types.js";
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../pg-core/session.js";
import { PgPreparedQuery, PgSession } from "../pg-core/session.js";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.js";
import { type Query, type SQL } from "../sql/sql.js";
import { type Assume } from "../utils.js";
export type NeonClient = Pool | PoolClient | Client;
export declare class NeonPreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
    private client;
    private params;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    static readonly [entityKind]: string;
    private rawQueryConfig;
    private queryConfig;
    constructor(client: NeonClient, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, name: string | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
    values(placeholderValues?: Record<string, unknown> | undefined): Promise<T['values']>;
}
export interface NeonSessionOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class NeonSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<NeonQueryResultHKT, TFullSchema, TSchema> {
    private client;
    private schema;
    private options;
    static readonly [entityKind]: string;
    private logger;
    private cache;
    constructor(client: NeonClient, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: NeonSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): PgPreparedQuery<T>;
    query(query: string, params: unknown[]): Promise<QueryResult>;
    queryObjects<T extends QueryResultRow>(query: string, params: unknown[]): Promise<QueryResult<T>>;
    count(sql: SQL): Promise<number>;
    transaction<T>(transaction: (tx: NeonTransaction<TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T>;
}
export declare class NeonTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<NeonQueryResultHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(transaction: (tx: NeonTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface NeonQueryResultHKT extends PgQueryResultHKT {
    type: QueryResult<Assume<this['row'], QueryResultRow>>;
}
