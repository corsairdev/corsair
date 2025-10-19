import { entityKind } from "../../entity.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import type { RunnableQuery } from "../../runnable-query.cjs";
import type { PreparedQuery } from "../../session.cjs";
import type { Query, SQL, SQLWrapper } from "../../sql/sql.cjs";
export interface PgRaw<TResult> extends QueryPromise<TResult>, RunnableQuery<TResult, 'pg'>, SQLWrapper {
}
export declare class PgRaw<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'pg'>, SQLWrapper, PreparedQuery {
    execute: () => Promise<TResult>;
    private sql;
    private query;
    private mapBatchResult;
    static readonly [entityKind]: string;
    readonly _: {
        readonly dialect: 'pg';
        readonly result: TResult;
    };
    constructor(execute: () => Promise<TResult>, sql: SQL, query: Query, mapBatchResult: (result: unknown) => unknown);
    getQuery(): Query;
    mapResult(result: unknown, isFromBatch?: boolean): unknown;
    _prepare(): PreparedQuery;
}
