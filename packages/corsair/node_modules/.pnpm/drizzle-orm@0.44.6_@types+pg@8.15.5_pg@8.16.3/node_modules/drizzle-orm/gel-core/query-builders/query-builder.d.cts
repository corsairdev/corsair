import { entityKind } from "../../entity.cjs";
import type { GelDialectConfig } from "../dialect.cjs";
import { GelDialect } from "../dialect.cjs";
import type { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import type { ColumnsSelection, SQLWrapper } from "../../sql/sql.cjs";
import { WithSubquery } from "../../subquery.cjs";
import type { GelColumn } from "../columns/index.cjs";
import type { WithSubqueryWithSelection } from "../subquery.cjs";
import { GelSelectBuilder } from "./select.cjs";
import type { SelectedFields } from "./select.types.cjs";
export declare class QueryBuilder {
    static readonly [entityKind]: string;
    private dialect;
    private dialectConfig;
    constructor(dialect?: GelDialect | GelDialectConfig);
    $with<TAlias extends string>(alias: TAlias): {
        as<TSelection extends ColumnsSelection>(qb: TypedQueryBuilder<TSelection> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelection>)): WithSubqueryWithSelection<TSelection, TAlias>;
    };
    with(...queries: WithSubquery[]): {
        select: {
            (): GelSelectBuilder<undefined, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): GelSelectBuilder<TSelection, "qb">;
        };
        selectDistinct: {
            (): GelSelectBuilder<undefined, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): GelSelectBuilder<TSelection, "qb">;
        };
        selectDistinctOn: {
            (on: (GelColumn | SQLWrapper)[]): GelSelectBuilder<undefined, "qb">;
            <TSelection extends SelectedFields>(on: (GelColumn | SQLWrapper)[], fields: TSelection): GelSelectBuilder<TSelection, "qb">;
        };
    };
    select(): GelSelectBuilder<undefined, 'qb'>;
    select<TSelection extends SelectedFields>(fields: TSelection): GelSelectBuilder<TSelection, 'qb'>;
    selectDistinct(): GelSelectBuilder<undefined>;
    selectDistinct<TSelection extends SelectedFields>(fields: TSelection): GelSelectBuilder<TSelection>;
    selectDistinctOn(on: (GelColumn | SQLWrapper)[]): GelSelectBuilder<undefined>;
    selectDistinctOn<TSelection extends SelectedFields>(on: (GelColumn | SQLWrapper)[], fields: TSelection): GelSelectBuilder<TSelection>;
    private getDialect;
}
