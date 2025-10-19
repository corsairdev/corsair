import type { Client, Connection, ExecutedQuery, Transaction } from '@planetscale/database';
import { type Cache } from "../cache/core/index.cjs";
import type { WithCacheConfig } from "../cache/core/types.cjs";
import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import type { MySqlDialect } from "../mysql-core/dialect.cjs";
import type { SelectedFieldsOrdered } from "../mysql-core/query-builders/select.types.cjs";
import { MySqlPreparedQuery, type MySqlPreparedQueryConfig, type MySqlPreparedQueryHKT, type MySqlQueryResultHKT, MySqlSession, MySqlTransaction } from "../mysql-core/session.cjs";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.cjs";
import { type Query, type SQL } from "../sql/sql.cjs";
import { type Assume } from "../utils.cjs";
export declare class PlanetScalePreparedQuery<T extends MySqlPreparedQueryConfig> extends MySqlPreparedQuery<T> {
    private client;
    private queryString;
    private params;
    private logger;
    private fields;
    private customResultMapper?;
    private generatedIds?;
    private returningIds?;
    static readonly [entityKind]: string;
    private rawQuery;
    private query;
    constructor(client: Client | Transaction | Connection, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined, generatedIds?: Record<string, unknown>[] | undefined, returningIds?: SelectedFieldsOrdered | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    iterator(_placeholderValues?: Record<string, unknown>): AsyncGenerator<T['iterator']>;
}
export interface PlanetscaleSessionOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class PlanetscaleSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends MySqlSession<MySqlQueryResultHKT, PlanetScalePreparedQueryHKT, TFullSchema, TSchema> {
    private baseClient;
    private schema;
    private options;
    static readonly [entityKind]: string;
    private logger;
    private client;
    private cache;
    constructor(baseClient: Client | Connection, dialect: MySqlDialect, tx: Transaction | undefined, schema: RelationalSchemaConfig<TSchema> | undefined, options?: PlanetscaleSessionOptions);
    prepareQuery<T extends MySqlPreparedQueryConfig = MySqlPreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered, queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): MySqlPreparedQuery<T>;
    query(query: string, params: unknown[]): Promise<ExecutedQuery>;
    queryObjects(query: string, params: unknown[]): Promise<ExecutedQuery>;
    all<T = unknown>(query: SQL): Promise<T[]>;
    count(sql: SQL): Promise<number>;
    transaction<T>(transaction: (tx: PlanetScaleTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export declare class PlanetScaleTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends MySqlTransaction<PlanetscaleQueryResultHKT, PlanetScalePreparedQueryHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    constructor(dialect: MySqlDialect, session: MySqlSession, schema: RelationalSchemaConfig<TSchema> | undefined, nestedIndex?: number);
    transaction<T>(transaction: (tx: PlanetScaleTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface PlanetscaleQueryResultHKT extends MySqlQueryResultHKT {
    type: ExecutedQuery;
}
export interface PlanetScalePreparedQueryHKT extends MySqlPreparedQueryHKT {
    type: PlanetScalePreparedQuery<Assume<this['config'], MySqlPreparedQueryConfig>>;
}
