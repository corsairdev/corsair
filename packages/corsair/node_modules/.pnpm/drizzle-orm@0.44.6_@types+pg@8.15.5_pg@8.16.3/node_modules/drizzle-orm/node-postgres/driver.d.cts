import { type Pool, type PoolConfig } from 'pg';
import type { Cache } from "../cache/core/cache.cjs";
import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import { PgDatabase } from "../pg-core/db.cjs";
import { PgDialect } from "../pg-core/dialect.cjs";
import { type RelationalSchemaConfig, type TablesRelationalConfig } from "../relations.cjs";
import { type DrizzleConfig } from "../utils.cjs";
import type { NodePgClient, NodePgQueryResultHKT } from "./session.cjs";
import { NodePgSession } from "./session.cjs";
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
