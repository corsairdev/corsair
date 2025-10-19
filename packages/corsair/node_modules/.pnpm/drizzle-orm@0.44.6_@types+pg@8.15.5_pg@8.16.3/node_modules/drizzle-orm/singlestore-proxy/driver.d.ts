import { entityKind } from "../entity.js";
import { SingleStoreDatabase } from "../singlestore-core/db.js";
import type { DrizzleConfig } from "../utils.js";
import { type SingleStoreRemotePreparedQueryHKT, type SingleStoreRemoteQueryResultHKT } from "./session.js";
export declare class SingleStoreRemoteDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends SingleStoreDatabase<SingleStoreRemoteQueryResultHKT, SingleStoreRemotePreparedQueryHKT, TSchema> {
    static readonly [entityKind]: string;
}
export type RemoteCallback = (sql: string, params: any[], method: 'all' | 'execute') => Promise<{
    rows: any[];
    insertId?: number;
    affectedRows?: number;
}>;
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(callback: RemoteCallback, config?: DrizzleConfig<TSchema>): SingleStoreRemoteDatabase<TSchema>;
