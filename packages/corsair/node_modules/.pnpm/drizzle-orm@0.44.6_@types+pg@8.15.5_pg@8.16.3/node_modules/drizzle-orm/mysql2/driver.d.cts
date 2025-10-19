import { type Connection as CallbackConnection, type Pool as CallbackPool, type PoolOptions } from 'mysql2';
import type { Connection, Pool } from 'mysql2/promise';
import type { Cache } from "../cache/core/index.cjs";
import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import { MySqlDatabase } from "../mysql-core/db.cjs";
import { MySqlDialect } from "../mysql-core/dialect.cjs";
import type { Mode } from "../mysql-core/session.cjs";
import { type RelationalSchemaConfig, type TablesRelationalConfig } from "../relations.cjs";
import { type DrizzleConfig } from "../utils.cjs";
import type { MySql2Client, MySql2PreparedQueryHKT, MySql2QueryResultHKT } from "./session.cjs";
import { MySql2Session } from "./session.cjs";
export interface MySqlDriverOptions {
    logger?: Logger;
    cache?: Cache;
}
export declare class MySql2Driver {
    private client;
    private dialect;
    private options;
    static readonly [entityKind]: string;
    constructor(client: MySql2Client, dialect: MySqlDialect, options?: MySqlDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined, mode: Mode): MySql2Session<Record<string, unknown>, TablesRelationalConfig>;
}
export { MySqlDatabase } from "../mysql-core/db.cjs";
export declare class MySql2Database<TSchema extends Record<string, unknown> = Record<string, never>> extends MySqlDatabase<MySql2QueryResultHKT, MySql2PreparedQueryHKT, TSchema> {
    static readonly [entityKind]: string;
}
export type MySql2DrizzleConfig<TSchema extends Record<string, unknown> = Record<string, never>> = Omit<DrizzleConfig<TSchema>, 'schema'> & ({
    schema: TSchema;
    mode: Mode;
} | {
    schema?: undefined;
    mode?: Mode;
});
export type AnyMySql2Connection = Pool | Connection | CallbackPool | CallbackConnection;
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends AnyMySql2Connection = CallbackPool>(...params: [
    TClient | string
] | [
    TClient | string,
    MySql2DrizzleConfig<TSchema>
] | [
    (MySql2DrizzleConfig<TSchema> & ({
        connection: string | PoolOptions;
    } | {
        client: TClient;
    }))
]): MySql2Database<TSchema> & {
    $client: AnyMySql2Connection extends TClient ? CallbackPool : TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: MySql2DrizzleConfig<TSchema>): MySql2Database<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
