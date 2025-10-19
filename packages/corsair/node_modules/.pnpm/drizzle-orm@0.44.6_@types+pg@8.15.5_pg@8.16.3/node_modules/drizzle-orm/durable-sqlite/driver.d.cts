import { entityKind } from "../entity.cjs";
import { BaseSQLiteDatabase } from "../sqlite-core/db.cjs";
import type { DrizzleConfig } from "../utils.cjs";
export declare class DrizzleSqliteDODatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends BaseSQLiteDatabase<'sync', SqlStorageCursor<Record<string, SqlStorageValue>>, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends DurableObjectStorage = DurableObjectStorage>(client: TClient, config?: DrizzleConfig<TSchema>): DrizzleSqliteDODatabase<TSchema> & {
    $client: TClient;
};
