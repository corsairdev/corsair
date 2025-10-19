import { entityKind } from "../entity.cjs";
import { MySqlDatabase } from "../mysql-core/db.cjs";
import type { DrizzleConfig } from "../utils.cjs";
import { type MySqlRemotePreparedQueryHKT, type MySqlRemoteQueryResultHKT } from "./session.cjs";
export declare class MySqlRemoteDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends MySqlDatabase<MySqlRemoteQueryResultHKT, MySqlRemotePreparedQueryHKT, TSchema> {
    static readonly [entityKind]: string;
}
export type RemoteCallback = (sql: string, params: any[], method: 'all' | 'execute') => Promise<{
    rows: any[];
    insertId?: number;
    affectedRows?: number;
}>;
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(callback: RemoteCallback, config?: DrizzleConfig<TSchema>): MySqlRemoteDatabase<TSchema>;
