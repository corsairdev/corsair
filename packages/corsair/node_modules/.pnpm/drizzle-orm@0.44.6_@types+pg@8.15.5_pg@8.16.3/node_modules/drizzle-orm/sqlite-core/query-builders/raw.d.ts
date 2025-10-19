import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";
import type { RunnableQuery } from "../../runnable-query.js";
import type { PreparedQuery } from "../../session.js";
import type { SQL, SQLWrapper } from "../../sql/sql.js";
import type { SQLiteAsyncDialect } from "../dialect.js";
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
        typings?: import("../../sql/sql.js").QueryTypingsValue[];
        sql: string;
        params: unknown[];
    };
    mapResult(result: unknown, isFromBatch?: boolean): unknown;
    _prepare(): PreparedQuery;
}
export {};
