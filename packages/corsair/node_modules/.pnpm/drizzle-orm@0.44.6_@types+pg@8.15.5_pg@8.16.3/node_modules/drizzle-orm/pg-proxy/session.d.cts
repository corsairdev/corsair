import { type Cache } from "../cache/core/cache.cjs";
import type { WithCacheConfig } from "../cache/core/types.cjs";
import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import type { PgDialect } from "../pg-core/dialect.cjs";
import { PgTransaction } from "../pg-core/index.cjs";
import type { SelectedFieldsOrdered } from "../pg-core/query-builders/select.types.cjs";
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from "../pg-core/session.cjs";
import { PgPreparedQuery as PreparedQueryBase, PgSession } from "../pg-core/session.cjs";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.cjs";
import type { QueryWithTypings } from "../sql/sql.cjs";
import { type Assume } from "../utils.cjs";
import type { RemoteCallback } from "./driver.cjs";
export interface PgRemoteSessionOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class PgRemoteSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<PgRemoteQueryResultHKT, TFullSchema, TSchema> {
    private client;
    private schema;
    static readonly [entityKind]: string;
    private logger;
    private cache;
    constructor(client: RemoteCallback, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: PgRemoteSessionOptions);
    prepareQuery<T extends PreparedQueryConfig>(query: QueryWithTypings, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute'], queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): PreparedQuery<T>;
    transaction<T>(_transaction: (tx: PgProxyTransaction<TFullSchema, TSchema>) => Promise<T>, _config?: PgTransactionConfig): Promise<T>;
}
export declare class PgProxyTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<PgRemoteQueryResultHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(_transaction: (tx: PgProxyTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export declare class PreparedQuery<T extends PreparedQueryConfig> extends PreparedQueryBase<T> {
    private client;
    private queryString;
    private params;
    private typings;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    static readonly [entityKind]: string;
    constructor(client: RemoteCallback, queryString: string, params: unknown[], typings: any[] | undefined, logger: Logger, cache: Cache, queryMetadata: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig: WithCacheConfig | undefined, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(): Promise<void>;
}
export interface PgRemoteQueryResultHKT extends PgQueryResultHKT {
    type: Assume<this['row'], {
        [column: string]: any;
    }>[];
}
