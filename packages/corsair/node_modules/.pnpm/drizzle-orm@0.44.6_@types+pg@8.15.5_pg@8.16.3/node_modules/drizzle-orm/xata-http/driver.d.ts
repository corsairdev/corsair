import type { Cache } from "../cache/core/cache.js";
import { entityKind } from "../entity.js";
import type { Logger } from "../logger.js";
import { PgDatabase } from "../pg-core/db.js";
import { PgDialect } from "../pg-core/dialect.js";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.js";
import type { DrizzleConfig } from "../utils.js";
import type { XataHttpClient, XataHttpQueryResultHKT } from "./session.js";
import { XataHttpSession } from "./session.js";
export interface XataDriverOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class XataHttpDriver {
    private client;
    private dialect;
    private options;
    static readonly [entityKind]: string;
    constructor(client: XataHttpClient, dialect: PgDialect, options?: XataDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined): XataHttpSession<Record<string, unknown>, TablesRelationalConfig>;
    initMappers(): void;
}
export declare class XataHttpDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends PgDatabase<XataHttpQueryResultHKT, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(client: XataHttpClient, config?: DrizzleConfig<TSchema>): XataHttpDatabase<TSchema> & {
    $client: XataHttpClient;
};
