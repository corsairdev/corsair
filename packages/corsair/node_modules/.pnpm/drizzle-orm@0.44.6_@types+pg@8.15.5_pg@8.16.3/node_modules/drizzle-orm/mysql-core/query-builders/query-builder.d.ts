import { entityKind } from "../../entity.js";
import type { MySqlDialectConfig } from "../dialect.js";
import { MySqlDialect } from "../dialect.js";
import type { WithBuilder } from "../subquery.js";
import { WithSubquery } from "../../subquery.js";
import { MySqlSelectBuilder } from "./select.js";
import type { SelectedFields } from "./select.types.js";
export declare class QueryBuilder {
    static readonly [entityKind]: string;
    private dialect;
    private dialectConfig;
    constructor(dialect?: MySqlDialect | MySqlDialectConfig);
    $with: WithBuilder;
    with(...queries: WithSubquery[]): {
        select: {
            (): MySqlSelectBuilder<undefined, never, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): MySqlSelectBuilder<TSelection, never, "qb">;
        };
        selectDistinct: {
            (): MySqlSelectBuilder<undefined, never, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): MySqlSelectBuilder<TSelection, never, "qb">;
        };
    };
    select(): MySqlSelectBuilder<undefined, never, 'qb'>;
    select<TSelection extends SelectedFields>(fields: TSelection): MySqlSelectBuilder<TSelection, never, 'qb'>;
    selectDistinct(): MySqlSelectBuilder<undefined, never, 'qb'>;
    selectDistinct<TSelection extends SelectedFields>(fields: TSelection): MySqlSelectBuilder<TSelection, never, 'qb'>;
    private getDialect;
}
