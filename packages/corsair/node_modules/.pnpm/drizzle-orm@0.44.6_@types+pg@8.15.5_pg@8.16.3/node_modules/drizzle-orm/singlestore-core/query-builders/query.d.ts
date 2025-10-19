import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";
import { type BuildQueryResult, type DBQueryConfig, type TableRelationalConfig, type TablesRelationalConfig } from "../../relations.js";
import type { Query } from "../../sql/sql.js";
import type { KnownKeysOnly } from "../../utils.js";
import type { SingleStoreDialect } from "../dialect.js";
import type { PreparedQueryHKTBase, PreparedQueryKind, SingleStorePreparedQueryConfig, SingleStoreSession } from "../session.js";
import type { SingleStoreTable } from "../table.js";
export declare class RelationalQueryBuilder<TPreparedQueryHKT extends PreparedQueryHKTBase, TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
    private fullSchema;
    private schema;
    private tableNamesMap;
    private table;
    private tableConfig;
    private dialect;
    private session;
    static readonly [entityKind]: string;
    constructor(fullSchema: Record<string, unknown>, schema: TSchema, tableNamesMap: Record<string, string>, table: SingleStoreTable, tableConfig: TableRelationalConfig, dialect: SingleStoreDialect, session: SingleStoreSession);
    findMany<TConfig extends DBQueryConfig<'many', true, TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'many', true, TSchema, TFields>>): SingleStoreRelationalQuery<TPreparedQueryHKT, BuildQueryResult<TSchema, TFields, TConfig>[]>;
    findFirst<TSelection extends Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>(config?: KnownKeysOnly<TSelection, Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>): SingleStoreRelationalQuery<TPreparedQueryHKT, BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
export declare class SingleStoreRelationalQuery<TPreparedQueryHKT extends PreparedQueryHKTBase, TResult> extends QueryPromise<TResult> {
    private fullSchema;
    private schema;
    private tableNamesMap;
    private table;
    private tableConfig;
    private dialect;
    private session;
    private config;
    private queryMode;
    static readonly [entityKind]: string;
    protected $brand: 'SingleStoreRelationalQuery';
    constructor(fullSchema: Record<string, unknown>, schema: TablesRelationalConfig, tableNamesMap: Record<string, string>, table: SingleStoreTable, tableConfig: TableRelationalConfig, dialect: SingleStoreDialect, session: SingleStoreSession, config: DBQueryConfig<'many', true> | true, queryMode: 'many' | 'first');
    prepare(): PreparedQueryKind<TPreparedQueryHKT, SingleStorePreparedQueryConfig & {
        execute: TResult;
    }, true>;
    private _getQuery;
    private _toSQL;
    toSQL(): Query;
    execute(): Promise<TResult>;
}
