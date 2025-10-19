import type { Row, RowList, Sql, TransactionSql } from 'postgres';
import { type Cache } from "../cache/core/index.js";
import type { WithCacheConfig } from "../cache/core/types.js";
import { entityKind } from "../entity.js";
import type { Logger } from "../logger.js";
import type { PgDialect } from "../pg-core/dialect.js";
import { PgTransaction } from "../pg-core/index.js";
import type { SelectedFieldsOrdered } from "../pg-core/query-builders/select.types.js";
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../pg-core/session.js";
import { PgPreparedQuery, PgSession } from "../pg-core/session.js";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.js";
import { type Query } from "../sql/sql.js";
import { type Assume } from "../utils.js";
export declare class PostgresJsPreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
    private client;
    private queryString;
    private params;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    static readonly [entityKind]: string;
    constructor(client: Sql, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
}
export interface PostgresJsSessionOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class PostgresJsSession<TSQL extends Sql, TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<PostgresJsQueryResultHKT, TFullSchema, TSchema> {
    client: TSQL;
    private schema;
    static readonly [entityKind]: string;
    logger: Logger;
    private cache;
    constructor(client: TSQL, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, 
    /** @internal */
    options?: PostgresJsSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): PgPreparedQuery<T>;
    query(query: string, params: unknown[]): Promise<RowList<Row[]>>;
    queryObjects<T extends Row>(query: string, params: unknown[]): Promise<RowList<T[]>>;
    transaction<T>(transaction: (tx: PostgresJsTransaction<TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T>;
}
export declare class PostgresJsTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<PostgresJsQueryResultHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    constructor(dialect: PgDialect, 
    /** @internal */
    session: PostgresJsSession<TransactionSql, TFullSchema, TSchema>, schema: RelationalSchemaConfig<TSchema> | undefined, nestedIndex?: number);
    transaction<T>(transaction: (tx: PostgresJsTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface PostgresJsQueryResultHKT extends PgQueryResultHKT {
    type: RowList<Assume<this['row'], Row>[]>;
}
