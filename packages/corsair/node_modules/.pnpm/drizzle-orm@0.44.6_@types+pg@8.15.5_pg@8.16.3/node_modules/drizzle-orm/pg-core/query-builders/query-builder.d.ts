import { entityKind } from "../../entity.js";
import type { PgDialectConfig } from "../dialect.js";
import { PgDialect } from "../dialect.js";
import type { SQLWrapper } from "../../sql/sql.js";
import { WithSubquery } from "../../subquery.js";
import type { PgColumn } from "../columns/index.js";
import type { WithBuilder } from "../subquery.js";
import { PgSelectBuilder } from "./select.js";
import type { SelectedFields } from "./select.types.js";
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
