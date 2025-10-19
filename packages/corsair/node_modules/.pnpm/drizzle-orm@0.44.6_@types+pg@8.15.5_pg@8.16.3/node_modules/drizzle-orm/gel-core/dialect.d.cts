import { entityKind } from "../entity.cjs";
import { GelColumn } from "./columns/index.cjs";
import type { GelDeleteConfig, GelInsertConfig, GelUpdateConfig } from "./query-builders/index.cjs";
import type { GelSelectConfig } from "./query-builders/select.types.cjs";
import { GelTable } from "./table.cjs";
import { type BuildRelationalQueryResult, type DBQueryConfig, type Relation, type TableRelationalConfig, type TablesRelationalConfig } from "../relations.cjs";
import { type DriverValueEncoder, type QueryTypingsValue, type QueryWithTypings, SQL } from "../sql/sql.cjs";
import { type Casing, type UpdateSet } from "../utils.cjs";
import type { GelMaterializedView } from "./view.cjs";
export interface GelDialectConfig {
    casing?: Casing;
}
export declare class GelDialect {
    static readonly [entityKind]: string;
    constructor(config?: GelDialectConfig);
    escapeName(name: string): string;
    escapeParam(num: number): string;
    escapeString(str: string): string;
    private buildWithCTE;
    buildDeleteQuery({ table, where, returning, withList }: GelDeleteConfig): SQL;
    buildUpdateSet(table: GelTable, set: UpdateSet): SQL;
    buildUpdateQuery({ table, set, where, returning, withList, from, joins }: GelUpdateConfig): SQL;
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
     * ^ Temporarily disabled behaviour, see comments within method for a reasoning
     */
    private buildSelection;
    private buildJoins;
    private buildFromTable;
    buildSelectQuery({ withList, fields, fieldsFlat, where, having, table, joins, orderBy, groupBy, limit, offset, lockingClause, distinct, setOperators, }: GelSelectConfig): SQL;
    buildSetOperations(leftSelect: SQL, setOperators: GelSelectConfig['setOperators']): SQL;
    buildSetOperationQuery({ leftSelect, setOperator: { type, isAll, rightSelect, limit, orderBy, offset }, }: {
        leftSelect: SQL;
        setOperator: GelSelectConfig['setOperators'][number];
    }): SQL;
    buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select, overridingSystemValue_ }: GelInsertConfig): SQL;
    buildRefreshMaterializedViewQuery({ view, concurrently, withNoData }: {
        view: GelMaterializedView;
        concurrently?: boolean;
        withNoData?: boolean;
    }): SQL;
    prepareTyping(encoder: DriverValueEncoder<unknown, unknown>): QueryTypingsValue;
    sqlToQuery(sql: SQL, invokeSource?: 'indexes' | undefined): QueryWithTypings;
    buildRelationalQueryWithoutPK({ fullSchema, schema, tableNamesMap, table, tableConfig, queryConfig: config, tableAlias, nestedQueryRelation, joinOn, }: {
        fullSchema: Record<string, unknown>;
        schema: TablesRelationalConfig;
        tableNamesMap: Record<string, string>;
        table: GelTable;
        tableConfig: TableRelationalConfig;
        queryConfig: true | DBQueryConfig<'many', true>;
        tableAlias: string;
        nestedQueryRelation?: Relation;
        joinOn?: SQL;
    }): BuildRelationalQueryResult<GelTable, GelColumn>;
}
