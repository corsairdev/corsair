import { entityKind } from "../entity.js";
import type { MigrationConfig, MigrationMeta } from "../migrator.js";
import { PgColumn } from "./columns/index.js";
import type { PgDeleteConfig, PgInsertConfig, PgUpdateConfig } from "./query-builders/index.js";
import type { PgSelectConfig } from "./query-builders/select.types.js";
import { PgTable } from "./table.js";
import { type BuildRelationalQueryResult, type DBQueryConfig, type Relation, type TableRelationalConfig, type TablesRelationalConfig } from "../relations.js";
import { type DriverValueEncoder, type QueryTypingsValue, type QueryWithTypings, SQL } from "../sql/sql.js";
import { type Casing, type UpdateSet } from "../utils.js";
import type { PgSession } from "./session.js";
import type { PgMaterializedView } from "./view.js";
export interface PgDialectConfig {
    casing?: Casing;
}
export declare class PgDialect {
    static readonly [entityKind]: string;
    constructor(config?: PgDialectConfig);
    migrate(migrations: MigrationMeta[], session: PgSession, config: string | MigrationConfig): Promise<void>;
    escapeName(name: string): string;
    escapeParam(num: number): string;
    escapeString(str: string): string;
    private buildWithCTE;
    buildDeleteQuery({ table, where, returning, withList }: PgDeleteConfig): SQL;
    buildUpdateSet(table: PgTable, set: UpdateSet): SQL;
    buildUpdateQuery({ table, set, where, returning, withList, from, joins }: PgUpdateConfig): SQL;
    /**
     * Builds selection SQL with provided fields/expressions
     *
     * Examples:
     *
     * `select <selection> from`
     *
     * `insert ... returning <selection>`
     *
     * If `isSingleTable` is true, then columns won't be prefixed with table name
     */
    private buildSelection;
    private buildJoins;
    private buildFromTable;
    buildSelectQuery({ withList, fields, fieldsFlat, where, having, table, joins, orderBy, groupBy, limit, offset, lockingClause, distinct, setOperators, }: PgSelectConfig): SQL;
    buildSetOperations(leftSelect: SQL, setOperators: PgSelectConfig['setOperators']): SQL;
    buildSetOperationQuery({ leftSelect, setOperator: { type, isAll, rightSelect, limit, orderBy, offset }, }: {
        leftSelect: SQL;
        setOperator: PgSelectConfig['setOperators'][number];
    }): SQL;
    buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select, overridingSystemValue_ }: PgInsertConfig): SQL;
    buildRefreshMaterializedViewQuery({ view, concurrently, withNoData }: {
        view: PgMaterializedView;
        concurrently?: boolean;
        withNoData?: boolean;
    }): SQL;
    prepareTyping(encoder: DriverValueEncoder<unknown, unknown>): QueryTypingsValue;
    sqlToQuery(sql: SQL, invokeSource?: 'indexes' | undefined): QueryWithTypings;
    buildRelationalQueryWithoutPK({ fullSchema, schema, tableNamesMap, table, tableConfig, queryConfig: config, tableAlias, nestedQueryRelation, joinOn, }: {
        fullSchema: Record<string, unknown>;
        schema: TablesRelationalConfig;
        tableNamesMap: Record<string, string>;
        table: PgTable;
        tableConfig: TableRelationalConfig;
        queryConfig: true | DBQueryConfig<'many', true>;
        tableAlias: string;
        nestedQueryRelation?: Relation;
        joinOn?: SQL;
    }): BuildRelationalQueryResult<PgTable, PgColumn>;
}
