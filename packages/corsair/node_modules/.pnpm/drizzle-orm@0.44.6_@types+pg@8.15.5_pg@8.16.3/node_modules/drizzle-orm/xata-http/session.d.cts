import type { SQLPluginResult, SQLQueryResult } from '@xata.io/client';
import type { Cache } from "../cache/core/index.cjs";
import type { WithCacheConfig } from "../cache/core/types.cjs";
import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import type { PgDialect } from "../pg-core/dialect.cjs";
import { PgTransaction } from "../pg-core/index.cjs";
import type { SelectedFieldsOrdered } from "../pg-core/query-builders/select.types.cjs";
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../pg-core/session.cjs";
import { PgPreparedQuery, PgSession } from "../pg-core/session.cjs";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.cjs";
import { type Query } from "../sql/sql.cjs";
export type XataHttpClient = {
    sql: SQLPluginResult;
};
export interface QueryResults<ArrayMode extends 'json' | 'array'> {
    rowCount: number;
    rows: ArrayMode extends 'array' ? any[][] : Record<string, any>[];
    rowAsArray: ArrayMode extends 'array' ? true : false;
}
export declare class XataHttpPreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
    private client;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    static readonly [entityKind]: string;
    constructor(client: XataHttpClient, query: Query, logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
    values(placeholderValues?: Record<string, unknown> | undefined): Promise<T['values']>;
}
export interface XataHttpSessionOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class XataHttpSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<XataHttpQueryResultHKT, TFullSchema, TSchema> {
    private client;
    private schema;
    private options;
    static readonly [entityKind]: string;
    private logger;
    private cache;
    constructor(client: XataHttpClient, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: XataHttpSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): PgPreparedQuery<T>;
    query(query: string, params: unknown[]): Promise<QueryResults<'array'>>;
    queryObjects(query: string, params: unknown[]): Promise<QueryResults<'json'>>;
    transaction<T>(_transaction: (tx: XataTransaction<TFullSchema, TSchema>) => Promise<T>, _config?: PgTransactionConfig): Promise<T>;
}
export declare class XataTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<XataHttpQueryResultHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(_transaction: (tx: XataTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface XataHttpQueryResultHKT extends PgQueryResultHKT {
    type: SQLQueryResult<this['row']>;
}
