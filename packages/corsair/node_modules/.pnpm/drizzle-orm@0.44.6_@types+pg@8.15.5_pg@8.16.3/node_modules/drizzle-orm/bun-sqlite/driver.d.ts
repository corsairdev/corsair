import { Database } from 'bun:sqlite';
import { entityKind } from "../entity.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { type DrizzleConfig } from "../utils.js";
export declare class BunSQLiteDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends BaseSQLiteDatabase<'sync', void, TSchema> {
    static readonly [entityKind]: string;
}
type DrizzleBunSqliteDatabaseOptions = {
    /**
     * Open the database as read-only (no write operations, no create).
     *
     * Equivalent to {@link constants.SQLITE_OPEN_READONLY}
     */
    readonly?: boolean;
    /**
     * Allow creating a new database
     *
     * Equivalent to {@link constants.SQLITE_OPEN_CREATE}
     */
    create?: boolean;
    /**
     * Open the database as read-write
     *
     * Equivalent to {@link constants.SQLITE_OPEN_READWRITE}
     */
    readwrite?: boolean;
};
export type DrizzleBunSqliteDatabaseConfig = ({
    source?: string;
} & DrizzleBunSqliteDatabaseOptions) | string | undefined;
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends Database = Database>(...params: [] | [
    TClient | string
] | [
    TClient | string,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        connection?: DrizzleBunSqliteDatabaseConfig;
    } | {
        client: TClient;
    }))
]): BunSQLiteDatabase<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): BunSQLiteDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
export {};
