import type { SavepointSQL, SQL, TransactionSQL } from 'bun';
import { type Cache } from "../cache/core/index.cjs";
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
import { type Assume } from "../utils.cjs";
export declare class BunSQLPreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
    private client;
    private queryString;
    private params;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    static readonly [entityKind]: string;
    constructor(client: SQL, queryString: string, params: unknown[], logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
}
export interface BunSQLSessionOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class BunSQLSession<TSQL extends SQL, TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<BunSQLQueryResultHKT, TFullSchema, TSchema> {
    client: TSQL;
    private schema;
    static readonly [entityKind]: string;
    logger: Logger;
    private cache;
    constructor(client: TSQL, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, 
    /** @internal */
    options?: BunSQLSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): PgPreparedQuery<T>;
    query(query: string, params: unknown[]): Promise<any>;
    queryObjects(query: string, params: unknown[]): Promise<any>;
    transaction<T>(transaction: (tx: BunSQLTransaction<TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T>;
}
export declare class BunSQLTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<BunSQLQueryResultHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    constructor(dialect: PgDialect, 
    /** @internal */
    session: BunSQLSession<TransactionSQL | SavepointSQL, TFullSchema, TSchema>, schema: RelationalSchemaConfig<TSchema> | undefined, nestedIndex?: number);
    transaction<T>(transaction: (tx: BunSQLTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface BunSQLQueryResultHKT extends PgQueryResultHKT {
    type: Assume<this['row'], Record<string, any>[]>;
}
