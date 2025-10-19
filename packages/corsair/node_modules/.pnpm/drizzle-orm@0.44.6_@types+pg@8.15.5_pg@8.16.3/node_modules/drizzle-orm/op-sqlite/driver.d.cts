import type { OPSQLiteConnection, QueryResult } from '@op-engineering/op-sqlite';
import { entityKind } from "../entity.cjs";
import { BaseSQLiteDatabase } from "../sqlite-core/db.cjs";
import type { DrizzleConfig } from "../utils.cjs";
export declare class OPSQLiteDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends BaseSQLiteDatabase<'async', QueryResult, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(client: OPSQLiteConnection, config?: DrizzleConfig<TSchema>): OPSQLiteDatabase<TSchema> & {
    $client: OPSQLiteConnection;
};
