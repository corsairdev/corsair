import { PGlite, type PGliteOptions } from '@electric-sql/pglite';
import type { Cache } from "../cache/core/cache.cjs";
import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import { PgDatabase } from "../pg-core/db.cjs";
import { PgDialect } from "../pg-core/dialect.cjs";
import { type RelationalSchemaConfig, type TablesRelationalConfig } from "../relations.cjs";
import { type DrizzleConfig } from "../utils.cjs";
import type { PgliteClient, PgliteQueryResultHKT } from "./session.cjs";
import { PgliteSession } from "./session.cjs";
export interface PgDriverOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class PgliteDriver {
    private client;
    private dialect;
    private options;
    static readonly [entityKind]: string;
    constructor(client: PgliteClient, dialect: PgDialect, options?: PgDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined): PgliteSession<Record<string, unknown>, TablesRelationalConfig>;
}
export declare class PgliteDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends PgDatabase<PgliteQueryResultHKT, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends PGlite = PGlite>(...params: [] | [
    TClient | string
] | [
    TClient | string,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        connection?: (PGliteOptions & {
            dataDir?: string;
        }) | string;
    } | {
        client: TClient;
    }))
]): PgliteDatabase<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): PgliteDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
