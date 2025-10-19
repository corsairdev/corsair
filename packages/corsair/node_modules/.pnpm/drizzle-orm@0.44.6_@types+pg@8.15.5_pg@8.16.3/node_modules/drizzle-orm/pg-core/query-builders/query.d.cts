import { entityKind } from "../../entity.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { type BuildQueryResult, type DBQueryConfig, type TableRelationalConfig, type TablesRelationalConfig } from "../../relations.cjs";
import type { RunnableQuery } from "../../runnable-query.cjs";
import type { Query, SQLWrapper } from "../../sql/sql.cjs";
import type { KnownKeysOnly } from "../../utils.cjs";
import type { PgDialect } from "../dialect.cjs";
import type { PgPreparedQuery, PgSession, PreparedQueryConfig } from "../session.cjs";
import type { PgTable } from "../table.cjs";
export declare class RelationalQueryBuilder<TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
    private fullSchema;
    private schema;
    private tableNamesMap;
    private table;
    private tableConfig;
    private dialect;
    private session;
    static readonly [entityKind]: string;
    constructor(fullSchema: Record<string, unknown>, schema: TSchema, tableNamesMap: Record<string, string>, table: PgTable, tableConfig: TableRelationalConfig, dialect: PgDialect, session: PgSession);
    findMany<TConfig extends DBQueryConfig<'many', true, TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'many', true, TSchema, TFields>>): PgRelationalQuery<BuildQueryResult<TSchema, TFields, TConfig>[]>;
    findFirst<TSelection extends Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>(config?: KnownKeysOnly<TSelection, Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>): PgRelationalQuery<BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
export declare class PgRelationalQuery<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'pg'>, SQLWrapper {
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
        readonly dialect: 'pg';
        readonly result: TResult;
    };
    constructor(fullSchema: Record<string, unknown>, schema: TablesRelationalConfig, tableNamesMap: Record<string, string>, table: PgTable, tableConfig: TableRelationalConfig, dialect: PgDialect, session: PgSession, config: DBQueryConfig<'many', true> | true, mode: 'many' | 'first');
    prepare(name: string): PgPreparedQuery<PreparedQueryConfig & {
        execute: TResult;
    }>;
    private _getQuery;
    private _toSQL;
    toSQL(): Query;
    private authToken?;
    execute(): Promise<TResult>;
}
