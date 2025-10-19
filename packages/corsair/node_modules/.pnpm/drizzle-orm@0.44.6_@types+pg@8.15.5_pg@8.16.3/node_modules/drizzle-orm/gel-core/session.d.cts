import { type Cache } from "../cache/core/cache.cjs";
import type { WithCacheConfig } from "../cache/core/types.cjs";
import { entityKind } from "../entity.cjs";
import type { TablesRelationalConfig } from "../relations.cjs";
import type { PreparedQuery } from "../session.cjs";
import type { Query, SQL } from "../sql/index.cjs";
import type { NeonAuthToken } from "../utils.cjs";
import { GelDatabase } from "./db.cjs";
import type { GelDialect } from "./dialect.cjs";
import type { SelectedFieldsOrdered } from "./query-builders/select.types.cjs";
export interface PreparedQueryConfig {
    execute: unknown;
    all: unknown;
    values: unknown;
}
export declare abstract class GelPreparedQuery<T extends PreparedQueryConfig> implements PreparedQuery {
    protected query: Query;
    private cache?;
    private queryMetadata?;
    private cacheConfig?;
    constructor(query: Query, cache?: Cache | undefined, queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    } | undefined, cacheConfig?: WithCacheConfig | undefined);
    protected authToken?: NeonAuthToken;
    getQuery(): Query;
    mapResult(response: unknown, _isFromBatch?: boolean): unknown;
    static readonly [entityKind]: string;
    abstract execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
}
export declare abstract class GelSession<TQueryResult extends GelQueryResultHKT = any, // TO
TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends TablesRelationalConfig = Record<string, never>> {
    protected dialect: GelDialect;
    static readonly [entityKind]: string;
    constructor(dialect: GelDialect);
    abstract prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => T['execute'], queryMetadata?: {
        type: 'select' | 'update' | 'delete' | 'insert';
        tables: string[];
    }, cacheConfig?: WithCacheConfig): GelPreparedQuery<T>;
    execute<T>(query: SQL): Promise<T>;
    all<T = unknown>(query: SQL): Promise<T[]>;
    count(sql: SQL): Promise<number>;
    abstract transaction<T>(transaction: (tx: GelTransaction<TQueryResult, TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export declare abstract class GelTransaction<TQueryResult extends GelQueryResultHKT, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends TablesRelationalConfig = Record<string, never>> extends GelDatabase<TQueryResult, TFullSchema, TSchema> {
    protected schema: {
        fullSchema: Record<string, unknown>;
        schema: TSchema;
        tableNamesMap: Record<string, string>;
    } | undefined;
    static readonly [entityKind]: string;
    constructor(dialect: GelDialect, session: GelSession<any, any, any>, schema: {
        fullSchema: Record<string, unknown>;
        schema: TSchema;
        tableNamesMap: Record<string, string>;
    } | undefined);
    rollback(): never;
    abstract transaction<T>(transaction: (tx: GelTransaction<TQueryResult, TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface GelQueryResultHKT {
    readonly $brand: 'GelQueryResultHKT';
    readonly row: unknown;
    readonly type: unknown;
}
export type GelQueryResultKind<TKind extends GelQueryResultHKT, TRow> = (TKind & {
    readonly row: TRow;
})['type'];
