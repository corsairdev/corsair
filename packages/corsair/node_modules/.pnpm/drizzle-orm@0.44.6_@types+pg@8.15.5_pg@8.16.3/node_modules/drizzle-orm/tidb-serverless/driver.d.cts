import { type Config, type Connection } from '@tidbcloud/serverless';
import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import { MySqlDatabase } from "../mysql-core/db.cjs";
import { type DrizzleConfig } from "../utils.cjs";
import type { TiDBServerlessPreparedQueryHKT, TiDBServerlessQueryResultHKT } from "./session.cjs";
export interface TiDBServerlessSDriverOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class TiDBServerlessDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends MySqlDatabase<TiDBServerlessQueryResultHKT, TiDBServerlessPreparedQueryHKT, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends Connection = Connection>(...params: [
    TClient | string
] | [
    TClient | string,
    DrizzleConfig<TSchema>
] | [
    ({
        connection: string | Config;
    } | {
        client: TClient;
    }) & DrizzleConfig<TSchema>
]): TiDBServerlessDatabase<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): TiDBServerlessDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
