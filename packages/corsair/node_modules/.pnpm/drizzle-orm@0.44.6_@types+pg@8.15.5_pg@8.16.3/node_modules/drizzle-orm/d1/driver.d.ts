import type { D1Database as MiniflareD1Database } from '@miniflare/d1';
import type { BatchItem, BatchResponse } from "../batch.js";
import { entityKind } from "../entity.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import type { DrizzleConfig, IfNotImported } from "../utils.js";
export type AnyD1Database = IfNotImported<D1Database, MiniflareD1Database, D1Database | IfNotImported<MiniflareD1Database, never, MiniflareD1Database>>;
export declare class DrizzleD1Database<TSchema extends Record<string, unknown> = Record<string, never>> extends BaseSQLiteDatabase<'async', D1Result, TSchema> {
    static readonly [entityKind]: string;
    batch<U extends BatchItem<'sqlite'>, T extends Readonly<[U, ...U[]]>>(batch: T): Promise<BatchResponse<T>>;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends AnyD1Database = AnyD1Database>(client: TClient, config?: DrizzleConfig<TSchema>): DrizzleD1Database<TSchema> & {
    $client: TClient;
};
