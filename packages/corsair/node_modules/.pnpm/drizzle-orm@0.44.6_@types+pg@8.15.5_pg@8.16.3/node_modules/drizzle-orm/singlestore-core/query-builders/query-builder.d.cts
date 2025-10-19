import { entityKind } from "../../entity.cjs";
import type { SingleStoreDialectConfig } from "../dialect.cjs";
import { SingleStoreDialect } from "../dialect.cjs";
import type { WithBuilder } from "../subquery.cjs";
import { WithSubquery } from "../../subquery.cjs";
import { SingleStoreSelectBuilder } from "./select.cjs";
import type { SelectedFields } from "./select.types.cjs";
export declare class QueryBuilder {
    static readonly [entityKind]: string;
    private dialect;
    private dialectConfig;
    constructor(dialect?: SingleStoreDialect | SingleStoreDialectConfig);
    $with: WithBuilder;
    with(...queries: WithSubquery[]): {
        select: {
            (): SingleStoreSelectBuilder<undefined, never, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, "qb">;
        };
        selectDistinct: {
            (): SingleStoreSelectBuilder<undefined, never, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, "qb">;
        };
    };
    select(): SingleStoreSelectBuilder<undefined, never, 'qb'>;
    select<TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, 'qb'>;
    selectDistinct(): SingleStoreSelectBuilder<undefined, never, 'qb'>;
    selectDistinct<TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, 'qb'>;
    private getDialect;
}
