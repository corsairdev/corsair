import { type Client, type Config } from '@libsql/client/web';
import { type DrizzleConfig } from "../../utils.cjs";
import { type LibSQLDatabase } from "../driver-core.cjs";
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
]): LibSQLDatabase<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): LibSQLDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
