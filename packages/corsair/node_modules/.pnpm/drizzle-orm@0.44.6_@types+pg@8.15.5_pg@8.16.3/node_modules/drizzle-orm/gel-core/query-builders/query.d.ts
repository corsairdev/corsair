import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";
import { type BuildQueryResult, type DBQueryConfig, type TableRelationalConfig, type TablesRelationalConfig } from "../../relations.js";
import type { RunnableQuery } from "../../runnable-query.js";
import type { Query, SQLWrapper } from "../../sql/sql.js";
import type { KnownKeysOnly } from "../../utils.js";
import type { GelDialect } from "../dialect.js";
import type { GelPreparedQuery, GelSession, PreparedQueryConfig } from "../session.js";
import type { GelTable } from "../table.js";
export declare class RelationalQueryBuilder<TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
    private fullSchema;
    private schema;
    private tableNamesMap;
    private table;
    private tableConfig;
    private dialect;
    private session;
    static readonly [entityKind]: string;
    constructor(fullSchema: Record<string, unknown>, schema: TSchema, tableNamesMap: Record<string, string>, table: GelTable, tableConfig: TableRelationalConfig, dialect: GelDialect, session: GelSession);
    findMany<TConfig extends DBQueryConfig<'many', true, TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'many', true, TSchema, TFields>>): GelRelationalQuery<BuildQueryResult<TSchema, TFields, TConfig>[]>;
    findFirst<TSelection extends Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>(config?: KnownKeysOnly<TSelection, Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>): GelRelationalQuery<BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
export declare class GelRelationalQuery<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'gel'>, SQLWrapper {
    private fullSchema;
    private schema;
    private tableNamesMap;
    private table;
    private tableConfig;
    private dialect;
    private session;
    private config;
    private mode;
    static readonly [entityKind]: string;
    readonly _: {
        readonly dialect: 'gel';
        readonly result: TResult;
    };
    constructor(fullSchema: Record<string, unknown>, schema: TablesRelationalConfig, tableNamesMap: Record<string, string>, table: GelTable, tableConfig: TableRelationalConfig, dialect: GelDialect, session: GelSession, config: DBQueryConfig<'many', true> | true, mode: 'many' | 'first');
    prepare(name: string): GelPreparedQuery<PreparedQueryConfig & {
        execute: TResult;
    }>;
    private _getQuery;
    private _toSQL;
    toSQL(): Query;
    execute(): Promise<TResult>;
}
