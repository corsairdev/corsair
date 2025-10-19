import { type Pool, type PoolConfig } from 'pg';
import type { Cache } from "../cache/core/cache.js";
import { entityKind } from "../entity.js";
import type { Logger } from "../logger.js";
import { PgDatabase } from "../pg-core/db.js";
import { PgDialect } from "../pg-core/dialect.js";
import { type RelationalSchemaConfig, type TablesRelationalConfig } from "../relations.js";
import { type DrizzleConfig } from "../utils.js";
import type { NodePgClient, NodePgQueryResultHKT } from "./session.js";
import { NodePgSession } from "./session.js";
export interface PgDriverOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class NodePgDriver {
    private client;
    private dialect;
    private options;
    static readonly [entityKind]: string;
    constructor(client: NodePgClient, dialect: PgDialect, options?: PgDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined): NodePgSession<Record<string, unknown>, TablesRelationalConfig>;
}
export declare class NodePgDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends PgDatabase<NodePgQueryResultHKT, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends NodePgClient = Pool>(...params: [
    TClient | string
] | [
    TClient | string,
    DrizzleConfig<TSchema>
] | [
    DrizzleConfig<TSchema> & ({
        client: TClient;
    } | {
        connection: string | PoolConfig;
    })
]): NodePgDatabase<TSchema> & {
    $client: NodePgClient extends TClient ? Pool : TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): NodePgDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
