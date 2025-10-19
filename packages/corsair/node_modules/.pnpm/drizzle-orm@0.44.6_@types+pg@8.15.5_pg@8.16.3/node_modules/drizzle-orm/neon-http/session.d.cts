import type { FullQueryResults, NeonQueryFunction } from '@neondatabase/serverless';
import type { BatchItem } from "../batch.cjs";
import { type Cache } from "../cache/core/index.cjs";
import type { WithCacheConfig } from "../cache/core/types.cjs";
import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import type { PgDialect } from "../pg-core/dialect.cjs";
import { PgTransaction } from "../pg-core/index.cjs";
import type { SelectedFieldsOrdered } from "../pg-core/query-builders/select.types.cjs";
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../pg-core/session.cjs";
import { PgPreparedQuery as PgPreparedQuery, PgSession } from "../pg-core/session.cjs";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.cjs";
import { type Query, type SQL } from "../sql/sql.cjs";
export type NeonHttpClient = NeonQueryFunction<any, any>;
export declare class NeonHttpPreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
    private client;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    static readonly [entityKind]: string;
    private clientQuery;
    constructor(client: NeonHttpClient, query: Query, logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues: Record<string, unknown> | undefined): Promise<T['execute']>;
    mapResult(result: unknown): unknown;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
    values(placeholderValues: Record<string, unknown> | undefined): Promise<T['values']>;
}
export interface NeonHttpSessionOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class NeonHttpSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<NeonHttpQueryResultHKT, TFullSchema, TSchema> {
    private client;
    private schema;
    private options;
    static readonly [entityKind]: string;
    private clientQuery;
    private logger;
    private cache;
    constructor(client: NeonHttpClient, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: NeonHttpSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): PgPreparedQuery<T>;
    batch<U extends BatchItem<'pg'>, T extends Readonly<[U, ...U[]]>>(queries: T): Promise<any>;
    query(query: string, params: unknown[]): Promise<FullQueryResults<true>>;
    queryObjects(query: string, params: unknown[]): Promise<FullQueryResults<false>>;
    count(sql: SQL): Promise<number>;
    transaction<T>(_transaction: (tx: NeonTransaction<TFullSchema, TSchema>) => Promise<T>, _config?: PgTransactionConfig): Promise<T>;
}
export declare class NeonTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<NeonHttpQueryResultHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(_transaction: (tx: NeonTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export type NeonHttpQueryResult<T> = Omit<FullQueryResults<false>, 'rows'> & {
    rows: T[];
};
export interface NeonHttpQueryResultHKT extends PgQueryResultHKT {
    type: NeonHttpQueryResult<this['row']>;
}
