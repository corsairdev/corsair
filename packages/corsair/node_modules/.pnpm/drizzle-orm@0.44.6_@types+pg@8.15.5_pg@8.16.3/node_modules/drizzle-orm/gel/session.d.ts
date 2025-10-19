import type { Client } from 'gel';
import type { Transaction } from 'gel/dist/transaction';
import { type Cache } from "../cache/core/index.js";
import type { WithCacheConfig } from "../cache/core/types.js";
import { entityKind } from "../entity.js";
import type { GelDialect } from "../gel-core/dialect.js";
import type { SelectedFieldsOrdered } from "../gel-core/query-builders/select.types.js";
import { GelPreparedQuery, GelSession, GelTransaction, type PreparedQueryConfig } from "../gel-core/session.js";
import { type Logger } from "../logger.js";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.js";
import { type Query, type SQL } from "../sql/sql.js";
export type GelClient = Client | Transaction;
export declare class GelDbPreparedQuery<T extends PreparedQueryConfig> extends GelPreparedQuery<T> {
    private client;
    private queryString;
    private params;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    private transaction;
    static readonly [entityKind]: string;
    constructor(client: GelClient, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined, transaction?: boolean);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
}
export interface GelSessionOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class GelDbSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends GelSession<GelQueryResultHKT, TFullSchema, TSchema> {
    private client;
    private schema;
    private options;
    static readonly [entityKind]: string;
    private logger;
    private cache;
    constructor(client: GelClient, dialect: GelDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: GelSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): GelDbPreparedQuery<T>;
    transaction<T>(transaction: (tx: GelTransaction<GelQueryResultHKT, TFullSchema, TSchema>) => Promise<T>): Promise<T>;
    count(sql: SQL): Promise<number>;
}
export declare class GelDbTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends GelTransaction<GelQueryResultHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(transaction: (tx: GelDbTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface GelQueryResultHKT {
    readonly $brand: 'GelQueryResultHKT';
    readonly row: unknown;
    readonly type: unknown;
}
