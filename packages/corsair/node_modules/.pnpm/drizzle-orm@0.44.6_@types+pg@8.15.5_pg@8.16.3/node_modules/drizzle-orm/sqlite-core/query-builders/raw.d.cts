import { entityKind } from "../../entity.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { RunnableQuery } from "../../runnable-query.cjs";
import type { PreparedQuery } from "../../session.cjs";
import type { SQL, SQLWrapper } from "../../sql/sql.cjs";
import type { SQLiteAsyncDialect } from "../dialect.cjs";
type SQLiteRawAction = 'all' | 'get' | 'values' | 'run';
export interface SQLiteRawConfig {
    action: SQLiteRawAction;
}
export interface SQLiteRaw<TResult> extends QueryPromise<TResult>, RunnableQuery<TResult, 'sqlite'>, SQLWrapper {
}
export declare class SQLiteRaw<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'sqlite'>, SQLWrapper, PreparedQuery {
    execute: () => Promise<TResult>;
    private dialect;
    private mapBatchResult;
    static readonly [entityKind]: string;
    readonly _: {
        readonly dialect: 'sqlite';
        readonly result: TResult;
    };
    constructor(execute: () => Promise<TResult>, 
    /** @internal */
    getSQL: () => SQL, action: SQLiteRawAction, dialect: SQLiteAsyncDialect, mapBatchResult: (result: unknown) => unknown);
    getQuery(): {
        method: SQLiteRawAction;
        typings?: import("../../sql/sql.ts").QueryTypingsValue[];
        sql: string;
        params: unknown[];
    };
    mapResult(result: unknown, isFromBatch?: boolean): unknown;
    _prepare(): PreparedQuery;
}
export {};
