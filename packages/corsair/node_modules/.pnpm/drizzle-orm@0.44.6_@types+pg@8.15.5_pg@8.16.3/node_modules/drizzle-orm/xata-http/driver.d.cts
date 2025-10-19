import type { Cache } from "../cache/core/cache.cjs";
import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import { PgDatabase } from "../pg-core/db.cjs";
import { PgDialect } from "../pg-core/dialect.cjs";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.cjs";
import type { DrizzleConfig } from "../utils.cjs";
import type { XataHttpClient, XataHttpQueryResultHKT } from "./session.cjs";
import { XataHttpSession } from "./session.cjs";
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
