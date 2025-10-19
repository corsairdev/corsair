import { entityKind } from "../../entity.js";
import type { GelDialectConfig } from "../dialect.js";
import { GelDialect } from "../dialect.js";
import type { TypedQueryBuilder } from "../../query-builders/query-builder.js";
import type { ColumnsSelection, SQLWrapper } from "../../sql/sql.js";
import { WithSubquery } from "../../subquery.js";
import type { GelColumn } from "../columns/index.js";
import type { WithSubqueryWithSelection } from "../subquery.js";
import { GelSelectBuilder } from "./select.js";
import type { SelectedFields } from "./select.types.js";
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
