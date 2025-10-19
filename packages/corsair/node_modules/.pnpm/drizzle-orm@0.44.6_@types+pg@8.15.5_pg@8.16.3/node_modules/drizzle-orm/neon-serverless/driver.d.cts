import { Pool, type PoolConfig } from '@neondatabase/serverless';
import type { Cache } from "../cache/core/cache.cjs";
import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import { PgDatabase } from "../pg-core/db.cjs";
import { PgDialect } from "../pg-core/dialect.cjs";
import { type RelationalSchemaConfig, type TablesRelationalConfig } from "../relations.cjs";
import { type DrizzleConfig } from "../utils.cjs";
import type { NeonClient, NeonQueryResultHKT } from "./session.cjs";
import { NeonSession } from "./session.cjs";
export interface NeonDriverOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class NeonDriver {
    private client;
    private dialect;
    private options;
    static readonly [entityKind]: string;
    constructor(client: NeonClient, dialect: PgDialect, options?: NeonDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined): NeonSession<Record<string, unknown>, TablesRelationalConfig>;
}
export declare class NeonDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends PgDatabase<NeonQueryResultHKT, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends NeonClient = Pool>(...params: [
    TClient | string
] | [
    TClient | string,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        connection: string | PoolConfig;
    } | {
        client: TClient;
    }) & {
        ws?: any;
    })
]): NeonDatabase<TSchema> & {
    $client: NeonClient extends TClient ? Pool : TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): NeonDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
