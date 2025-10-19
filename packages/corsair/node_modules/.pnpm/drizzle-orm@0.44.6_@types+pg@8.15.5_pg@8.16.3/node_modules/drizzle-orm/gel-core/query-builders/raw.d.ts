import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";
import type { RunnableQuery } from "../../runnable-query.js";
import type { PreparedQuery } from "../../session.js";
import type { Query, SQL, SQLWrapper } from "../../sql/sql.js";
export interface GelRaw<TResult> extends QueryPromise<TResult>, RunnableQuery<TResult, 'gel'>, SQLWrapper {
}
export declare class GelRaw<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'gel'>, SQLWrapper, PreparedQuery {
    execute: () => Promise<TResult>;
    private sql;
    private query;
    private mapBatchResult;
    static readonly [entityKind]: string;
    readonly _: {
        readonly dialect: 'gel';
        readonly result: TResult;
    };
    constructor(execute: () => Promise<TResult>, sql: SQL, query: Query, mapBatchResult: (result: unknown) => unknown);
    getQuery(): Query;
    mapResult(result: unknown, isFromBatch?: boolean): unknown;
    _prepare(): PreparedQuery;
}
