import { entityKind } from "../../entity.js";
import type { SingleStoreDialectConfig } from "../dialect.js";
import { SingleStoreDialect } from "../dialect.js";
import type { WithBuilder } from "../subquery.js";
import { WithSubquery } from "../../subquery.js";
import { SingleStoreSelectBuilder } from "./select.js";
import type { SelectedFields } from "./select.types.js";
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
