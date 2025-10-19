import type { ExecuteStatementCommandOutput, RDSDataClient } from '@aws-sdk/client-rds-data';
import type { Cache } from "../../cache/core/cache.js";
import type { WithCacheConfig } from "../../cache/core/types.js";
import { entityKind } from "../../entity.js";
import type { Logger } from "../../logger.js";
import { type PgDialect, PgPreparedQuery, type PgQueryResultHKT, PgSession, PgTransaction, type PgTransactionConfig, type PreparedQueryConfig } from "../../pg-core/index.js";
import type { SelectedFieldsOrdered } from "../../pg-core/query-builders/select.types.js";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../../relations.js";
import { type QueryTypingsValue, type QueryWithTypings, type SQL } from "../../sql/sql.js";
export type AwsDataApiClient = RDSDataClient;
export declare class AwsDataApiPreparedQuery<T extends PreparedQueryConfig & {
    values: AwsDataApiPgQueryResult<unknown[]>;
}> extends PgPreparedQuery<T> {
    private client;
    private queryString;
    private params;
    private typings;
    private options;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    static readonly [entityKind]: string;
    private rawQuery;
    constructor(client: AwsDataApiClient, queryString: string, params: unknown[], typings: QueryTypingsValue[], options: AwsDataApiSessionOptions, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, 
    /** @internal */
    transactionId: string | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
    values(placeholderValues?: Record<string, unknown>): Promise<T['values']>;
}
export interface AwsDataApiSessionOptions {
    logger?: Logger;
    cache?: Cache;
    database: string;
    resourceArn: string;
    secretArn: string;
}
export declare class AwsDataApiSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<AwsDataApiPgQueryResultHKT, TFullSchema, TSchema> {
    private schema;
    private options;
    static readonly [entityKind]: string;
    private cache;
    constructor(
    /** @internal */
    client: AwsDataApiClient, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options: AwsDataApiSessionOptions, 
    /** @internal */
    transactionId: string | undefined);
    prepareQuery<T extends PreparedQueryConfig & {
        values: AwsDataApiPgQueryResult<unknown[]>;
    } = PreparedQueryConfig & {
        values: AwsDataApiPgQueryResult<unknown[]>;
    }>(query: QueryWithTypings, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig, transactionId?: string): AwsDataApiPreparedQuery<T>;
    execute<T>(query: SQL): Promise<T>;
    transaction<T>(transaction: (tx: AwsDataApiTransaction<TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig | undefined): Promise<T>;
}
export declare class AwsDataApiTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<AwsDataApiPgQueryResultHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(transaction: (tx: AwsDataApiTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export type AwsDataApiPgQueryResult<T> = ExecuteStatementCommandOutput & {
    rows: T[];
};
export interface AwsDataApiPgQueryResultHKT extends PgQueryResultHKT {
    type: AwsDataApiPgQueryResult<any>;
}
