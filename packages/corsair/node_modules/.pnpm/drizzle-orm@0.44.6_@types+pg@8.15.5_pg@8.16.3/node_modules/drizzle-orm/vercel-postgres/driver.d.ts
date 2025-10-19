import { sql } from '@vercel/postgres';
import type { Cache } from "../cache/core/cache.js";
import { entityKind } from "../entity.js";
import type { Logger } from "../logger.js";
import { PgDatabase } from "../pg-core/db.js";
import { PgDialect } from "../pg-core/index.js";
import { type RelationalSchemaConfig, type TablesRelationalConfig } from "../relations.js";
import { type DrizzleConfig } from "../utils.js";
import { type VercelPgClient, type VercelPgQueryResultHKT, VercelPgSession } from "./session.js";
export interface VercelPgDriverOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class VercelPgDriver {
    private client;
    private dialect;
    private options;
    static readonly [entityKind]: string;
    constructor(client: VercelPgClient, dialect: PgDialect, options?: VercelPgDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined): VercelPgSession<Record<string, unknown>, TablesRelationalConfig>;
}
export declare class VercelPgDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends PgDatabase<VercelPgQueryResultHKT, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends VercelPgClient = typeof sql>(...params: [] | [
    TClient
] | [
    TClient,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        client?: TClient;
    }))
]): VercelPgDatabase<TSchema> & {
    $client: VercelPgClient extends TClient ? typeof sql : TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): VercelPgDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
