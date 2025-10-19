import { entityKind } from "../../entity.cjs";
import type { PgDialectConfig } from "../dialect.cjs";
import { PgDialect } from "../dialect.cjs";
import type { SQLWrapper } from "../../sql/sql.cjs";
import { WithSubquery } from "../../subquery.cjs";
import type { PgColumn } from "../columns/index.cjs";
import type { WithBuilder } from "../subquery.cjs";
import { PgSelectBuilder } from "./select.cjs";
import type { SelectedFields } from "./select.types.cjs";
export declare class QueryBuilder {
    static readonly [entityKind]: string;
    private dialect;
    private dialectConfig;
    constructor(dialect?: PgDialect | PgDialectConfig);
    $with: WithBuilder;
    with(...queries: WithSubquery[]): {
        select: {
            (): PgSelectBuilder<undefined, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): PgSelectBuilder<TSelection, "qb">;
        };
        selectDistinct: {
            (): PgSelectBuilder<undefined, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): PgSelectBuilder<TSelection, "qb">;
        };
        selectDistinctOn: {
            (on: (PgColumn | SQLWrapper)[]): PgSelectBuilder<undefined, "qb">;
            <TSelection extends SelectedFields>(on: (PgColumn | SQLWrapper)[], fields: TSelection): PgSelectBuilder<TSelection, "qb">;
        };
    };
    select(): PgSelectBuilder<undefined, 'qb'>;
    select<TSelection extends SelectedFields>(fields: TSelection): PgSelectBuilder<TSelection, 'qb'>;
    selectDistinct(): PgSelectBuilder<undefined>;
    selectDistinct<TSelection extends SelectedFields>(fields: TSelection): PgSelectBuilder<TSelection>;
    selectDistinctOn(on: (PgColumn | SQLWrapper)[]): PgSelectBuilder<undefined>;
    selectDistinctOn<TSelection extends SelectedFields>(on: (PgColumn | SQLWrapper)[], fields: TSelection): PgSelectBuilder<TSelection>;
    private getDialect;
}
