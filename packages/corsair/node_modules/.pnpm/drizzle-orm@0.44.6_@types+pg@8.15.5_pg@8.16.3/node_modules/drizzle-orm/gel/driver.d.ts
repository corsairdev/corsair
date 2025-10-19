import { type Client, type ConnectOptions } from 'gel';
import type { Cache } from "../cache/core/index.js";
import { entityKind } from "../entity.js";
import { GelDatabase } from "../gel-core/db.js";
import { GelDialect } from "../gel-core/dialect.js";
import type { GelQueryResultHKT } from "../gel-core/session.js";
import type { Logger } from "../logger.js";
import { type RelationalSchemaConfig, type TablesRelationalConfig } from "../relations.js";
import { type DrizzleConfig } from "../utils.js";
import type { GelClient } from "./session.js";
import { GelDbSession } from "./session.js";
export interface GelDriverOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class GelDriver {
    private client;
    private dialect;
    private options;
    static readonly [entityKind]: string;
    constructor(client: GelClient, dialect: GelDialect, options?: GelDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined): GelDbSession<Record<string, unknown>, TablesRelationalConfig>;
}
export declare class GelJsDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends GelDatabase<GelQueryResultHKT, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends GelClient = Client>(...params: [TClient | string] | [TClient | string, DrizzleConfig<TSchema>] | [
    DrizzleConfig<TSchema> & ({
        connection: string | ConnectOptions;
    } | {
        client: TClient;
    })
]): GelJsDatabase<TSchema> & {
    $client: GelClient extends TClient ? Client : TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): GelJsDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
