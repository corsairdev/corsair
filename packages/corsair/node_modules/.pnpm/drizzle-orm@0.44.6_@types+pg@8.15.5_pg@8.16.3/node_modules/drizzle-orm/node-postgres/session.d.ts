import type { Client, PoolClient, QueryResult, QueryResultRow } from 'pg';
import pg from 'pg';
import { type Cache } from "../cache/core/index.js";
import type { WithCacheConfig } from "../cache/core/types.js";
import { entityKind } from "../entity.js";
import { type Logger } from "../logger.js";
import type { PgDialect } from "../pg-core/dialect.js";
import { PgTransaction } from "../pg-core/index.js";
import type { SelectedFieldsOrdered } from "../pg-core/query-builders/select.types.js";
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../pg-core/session.js";
import { PgPreparedQuery, PgSession } from "../pg-core/session.js";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.js";
import { type Query, type SQL } from "../sql/sql.js";
import { type Assume } from "../utils.js";
export type NodePgClient = pg.Pool | PoolClient | Client;
export declare class NodePgPreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
    private client;
    private queryString;
    private params;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    static readonly [entityKind]: string;
    private rawQueryConfig;
    private queryConfig;
    constructor(client: NodePgClient, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, name: string | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
}
export interface NodePgSessionOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class NodePgSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<NodePgQueryResultHKT, TFullSchema, TSchema> {
    private client;
    private schema;
    private options;
    static readonly [entityKind]: string;
    private logger;
    private cache;
    constructor(client: NodePgClient, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: NodePgSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): PgPreparedQuery<T>;
    transaction<T>(transaction: (tx: NodePgTransaction<TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig | undefined): Promise<T>;
    count(sql: SQL): Promise<number>;
}
export declare class NodePgTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<NodePgQueryResultHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(transaction: (tx: NodePgTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface NodePgQueryResultHKT extends PgQueryResultHKT {
    type: QueryResult<Assume<this['row'], QueryResultRow>>;
}
