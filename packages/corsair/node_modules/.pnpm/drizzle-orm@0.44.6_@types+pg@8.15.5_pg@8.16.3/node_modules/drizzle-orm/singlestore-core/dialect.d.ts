import { entityKind } from "../entity.js";
import type { MigrationConfig, MigrationMeta } from "../migrator.js";
import { type BuildRelationalQueryResult, type DBQueryConfig, type Relation, type TableRelationalConfig, type TablesRelationalConfig } from "../relations.js";
import type { QueryWithTypings } from "../sql/sql.js";
import { SQL } from "../sql/sql.js";
import { type Casing, type UpdateSet } from "../utils.js";
import { SingleStoreColumn } from "./columns/common.js";
import type { SingleStoreDeleteConfig } from "./query-builders/delete.js";
import type { SingleStoreInsertConfig } from "./query-builders/insert.js";
import type { SingleStoreSelectConfig } from "./query-builders/select.types.js";
import type { SingleStoreUpdateConfig } from "./query-builders/update.js";
import type { SingleStoreSession } from "./session.js";
import { SingleStoreTable } from "./table.js";
export interface SingleStoreDialectConfig {
    casing?: Casing;
}
export declare class SingleStoreDialect {
    static readonly [entityKind]: string;
    constructor(config?: SingleStoreDialectConfig);
    migrate(migrations: MigrationMeta[], session: SingleStoreSession, config: Omit<MigrationConfig, 'migrationsSchema'>): Promise<void>;
    escapeName(name: string): string;
    escapeParam(_num: number): string;
    escapeString(str: string): string;
    private buildWithCTE;
    buildDeleteQuery({ table, where, returning, withList, limit, orderBy }: SingleStoreDeleteConfig): SQL;
    buildUpdateSet(table: SingleStoreTable, set: UpdateSet): SQL;
    buildUpdateQuery({ table, set, where, returning, withList, limit, orderBy }: SingleStoreUpdateConfig): SQL;
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
    private buildLimit;
    private buildOrderBy;
    buildSelectQuery({ withList, fields, fieldsFlat, where, having, table, joins, orderBy, groupBy, limit, offset, lockingClause, distinct, setOperators, }: SingleStoreSelectConfig): SQL;
    buildSetOperations(leftSelect: SQL, setOperators: SingleStoreSelectConfig['setOperators']): SQL;
    buildSetOperationQuery({ leftSelect, setOperator: { type, isAll, rightSelect, limit, orderBy, offset }, }: {
        leftSelect: SQL;
        setOperator: SingleStoreSelectConfig['setOperators'][number];
    }): SQL;
    buildInsertQuery({ table, values, ignore, onConflict }: SingleStoreInsertConfig): {
        sql: SQL;
        generatedIds: Record<string, unknown>[];
    };
    sqlToQuery(sql: SQL, invokeSource?: 'indexes' | undefined): QueryWithTypings;
    buildRelationalQuery({ fullSchema, schema, tableNamesMap, table, tableConfig, queryConfig: config, tableAlias, nestedQueryRelation, joinOn, }: {
        fullSchema: Record<string, unknown>;
        schema: TablesRelationalConfig;
        tableNamesMap: Record<string, string>;
        table: SingleStoreTable;
        tableConfig: TableRelationalConfig;
        queryConfig: true | DBQueryConfig<'many', true>;
        tableAlias: string;
        nestedQueryRelation?: Relation;
        joinOn?: SQL;
    }): BuildRelationalQueryResult<SingleStoreTable, SingleStoreColumn>;
}
