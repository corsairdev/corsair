import type { SQLOptions } from 'bun';
import { SQL } from 'bun';
import { entityKind } from "../entity.js";
import { PgDatabase } from "../pg-core/db.js";
import { type DrizzleConfig } from "../utils.js";
import type { BunSQLQueryResultHKT } from "./session.js";
export declare class BunSQLDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends PgDatabase<BunSQLQueryResultHKT, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends SQL = SQL>(...params: [
    TClient | string
] | [
    TClient | string,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        connection: string | ({
            url?: string;
        } & SQLOptions);
    } | {
        client: TClient;
    }))
]): BunSQLDatabase<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): BunSQLDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
