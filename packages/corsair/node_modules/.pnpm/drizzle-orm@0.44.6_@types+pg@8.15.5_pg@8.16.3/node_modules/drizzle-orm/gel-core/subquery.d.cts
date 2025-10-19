import type { AddAliasToSelection } from "../query-builders/select.types.cjs";
import type { ColumnsSelection } from "../sql/sql.cjs";
import type { Subquery, WithSubquery } from "../subquery.cjs";
export type SubqueryWithSelection<TSelection extends ColumnsSelection, TAlias extends string> = Subquery<TAlias, AddAliasToSelection<TSelection, TAlias, 'gel'>> & AddAliasToSelection<TSelection, TAlias, 'gel'>;
export type WithSubqueryWithSelection<TSelection extends ColumnsSelection, TAlias extends string> = WithSubquery<TAlias, AddAliasToSelection<TSelection, TAlias, 'gel'>> & AddAliasToSelection<TSelection, TAlias, 'gel'>;
