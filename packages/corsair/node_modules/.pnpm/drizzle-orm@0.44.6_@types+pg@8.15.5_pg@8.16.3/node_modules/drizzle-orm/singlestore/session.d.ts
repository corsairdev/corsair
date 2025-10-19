import type { Connection, FieldPacket, OkPacket, Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { type Cache } from "../cache/core/index.js";
import type { WithCacheConfig } from "../cache/core/types.js";
import { entityKind } from "../entity.js";
import type { Logger } from "../logger.js";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.js";
import type { SingleStoreDialect } from "../singlestore-core/dialect.js";
import type { SelectedFieldsOrdered } from "../singlestore-core/query-builders/select.types.js";
import { type PreparedQueryKind, SingleStorePreparedQuery, type SingleStorePreparedQueryConfig, type SingleStorePreparedQueryHKT, type SingleStoreQueryResultHKT, SingleStoreSession, SingleStoreTransaction, type SingleStoreTransactionConfig } from "../singlestore-core/session.js";
import type { Query, SQL } from "../sql/sql.js";
import { type Assume } from "../utils.js";
export type SingleStoreDriverClient = Pool | Connection;
export type SingleStoreRawQueryResult = [ResultSetHeader, FieldPacket[]];
export type SingleStoreQueryResultType = RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader;
export type SingleStoreQueryResult<T = any> = [T extends ResultSetHeader ? T : T[], FieldPacket[]];
export declare class SingleStoreDriverPreparedQuery<T extends SingleStorePreparedQueryConfig> extends SingleStorePreparedQuery<T> {
    private client;
    private params;
    private logger;
    private fields;
    private customResultMapper?;
    private generatedIds?;
    private returningIds?;
    static readonly [entityKind]: string;
    private rawQuery;
    private query;
    constructor(client: SingleStoreDriverClient, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined, generatedIds?: Record<string, unknown>[] | undefined, returningIds?: SelectedFieldsOrdered | undefined);
    execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
    iterator(placeholderValues?: Record<string, unknown>): AsyncGenerator<T['execute'] extends any[] ? T['execute'][number] : T['execute']>;
}
export interface SingleStoreDriverSessionOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class SingleStoreDriverSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SingleStoreSession<SingleStoreQueryResultHKT, SingleStoreDriverPreparedQueryHKT, TFullSchema, TSchema> {
    private client;
    private schema;
    private options;
    static readonly [entityKind]: string;
    private logger;
    private cache;
    constructor(client: SingleStoreDriverClient, dialect: SingleStoreDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options: SingleStoreDriverSessionOptions);
    prepareQuery<T extends SingleStorePreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered, queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): PreparedQueryKind<SingleStoreDriverPreparedQueryHKT, T>;
    all<T = unknown>(query: SQL): Promise<T[]>;
    transaction<T>(transaction: (tx: SingleStoreDriverTransaction<TFullSchema, TSchema>) => Promise<T>, config?: SingleStoreTransactionConfig): Promise<T>;
}
export declare class SingleStoreDriverTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SingleStoreTransaction<SingleStoreDriverQueryResultHKT, SingleStoreDriverPreparedQueryHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(transaction: (tx: SingleStoreDriverTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface SingleStoreDriverQueryResultHKT extends SingleStoreQueryResultHKT {
    type: SingleStoreRawQueryResult;
}
export interface SingleStoreDriverPreparedQueryHKT extends SingleStorePreparedQueryHKT {
    type: SingleStoreDriverPreparedQuery<Assume<this['config'], SingleStorePreparedQueryConfig>>;
}
