import type { Config } from '@planetscale/database';
import { Client } from '@planetscale/database';
import { entityKind } from "../entity.js";
import type { Logger } from "../logger.js";
import { MySqlDatabase } from "../mysql-core/db.js";
import { type DrizzleConfig } from "../utils.js";
import type { PlanetScalePreparedQueryHKT, PlanetscaleQueryResultHKT } from "./session.js";
export interface PlanetscaleSDriverOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class PlanetScaleDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends MySqlDatabase<PlanetscaleQueryResultHKT, PlanetScalePreparedQueryHKT, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends Client = Client>(...params: [
    TClient | string
] | [
    TClient | string,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        connection: string | Config;
    } | {
        client: TClient;
    }))
]): PlanetScaleDatabase<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): PlanetScaleDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
