import type { TypedQueryBuilder } from "../query-builders/query-builder.js";
import type { AddAliasToSelection } from "../query-builders/select.types.js";
import type { ColumnsSelection, SQL } from "../sql/sql.js";
import type { Subquery, WithSubquery, WithSubqueryWithoutSelection } from "../subquery.js";
import type { QueryBuilder } from "./query-builders/query-builder.js";
export type SubqueryWithSelection<TSelection extends ColumnsSelection, TAlias extends string> = Subquery<TAlias, AddAliasToSelection<TSelection, TAlias, 'sqlite'>> & AddAliasToSelection<TSelection, TAlias, 'sqlite'>;
export type WithSubqueryWithSelection<TSelection extends ColumnsSelection, TAlias extends string> = WithSubquery<TAlias, AddAliasToSelection<TSelection, TAlias, 'sqlite'>> & AddAliasToSelection<TSelection, TAlias, 'sqlite'>;
export interface WithBuilder {
    <TAlias extends string>(alias: TAlias): {
        as: {
            <TSelection extends ColumnsSelection>(qb: TypedQueryBuilder<TSelection> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelection>)): WithSubqueryWithSelection<TSelection, TAlias>;
            (qb: TypedQueryBuilder<undefined> | ((qb: QueryBuilder) => TypedQueryBuilder<undefined>)): WithSubqueryWithoutSelection<TAlias>;
        };
    };
    <TAlias extends string, TSelection extends ColumnsSelection>(alias: TAlias, selection: TSelection): {
        as: (qb: SQL | ((qb: QueryBuilder) => SQL)) => WithSubqueryWithSelection<TSelection, TAlias>;
    };
}
