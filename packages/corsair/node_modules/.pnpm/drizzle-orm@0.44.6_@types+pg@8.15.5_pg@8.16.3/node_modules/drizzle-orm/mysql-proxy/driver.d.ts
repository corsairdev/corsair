import { entityKind } from "../entity.js";
import { MySqlDatabase } from "../mysql-core/db.js";
import type { DrizzleConfig } from "../utils.js";
import { type MySqlRemotePreparedQueryHKT, type MySqlRemoteQueryResultHKT } from "./session.js";
export declare class MySqlRemoteDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends MySqlDatabase<MySqlRemoteQueryResultHKT, MySqlRemotePreparedQueryHKT, TSchema> {
    static readonly [entityKind]: string;
}
export type RemoteCallback = (sql: string, params: any[], method: 'all' | 'execute') => Promise<{
    rows: any[];
    insertId?: number;
    affectedRows?: number;
}>;
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(callback: RemoteCallback, config?: DrizzleConfig<TSchema>): MySqlRemoteDatabase<TSchema>;
