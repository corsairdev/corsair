import { entityKind } from "../../entity.js";
import type { GelDialect } from "../dialect.js";
import type { GelPreparedQuery, GelQueryResultHKT, GelQueryResultKind, GelSession, PreparedQueryConfig } from "../session.js";
import type { GelMaterializedView } from "../view.js";
import { QueryPromise } from "../../query-promise.js";
import type { RunnableQuery } from "../../runnable-query.js";
import type { Query, SQLWrapper } from "../../sql/sql.js";
export interface GelRefreshMaterializedView<TQueryResult extends GelQueryResultHKT> extends QueryPromise<GelQueryResultKind<TQueryResult, never>>, RunnableQuery<GelQueryResultKind<TQueryResult, never>, 'gel'>, SQLWrapper {
    readonly _: {
        readonly dialect: 'gel';
        readonly result: GelQueryResultKind<TQueryResult, never>;
    };
}
export declare class GelRefreshMaterializedView<TQueryResult extends GelQueryResultHKT> extends QueryPromise<GelQueryResultKind<TQueryResult, never>> implements RunnableQuery<GelQueryResultKind<TQueryResult, never>, 'gel'>, SQLWrapper {
    private session;
    private dialect;
    static readonly [entityKind]: string;
    private config;
    constructor(view: GelMaterializedView, session: GelSession, dialect: GelDialect);
    concurrently(): this;
    withNoData(): this;
    toSQL(): Query;
    prepare(name: string): GelPreparedQuery<PreparedQueryConfig & {
        execute: GelQueryResultKind<TQueryResult, never>;
    }>;
    execute: ReturnType<this['prepare']>['execute'];
}
