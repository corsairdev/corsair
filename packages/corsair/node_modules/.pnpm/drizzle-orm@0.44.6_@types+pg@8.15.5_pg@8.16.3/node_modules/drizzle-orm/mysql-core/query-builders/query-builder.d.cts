import { entityKind } from "../../entity.cjs";
import type { MySqlDialectConfig } from "../dialect.cjs";
import { MySqlDialect } from "../dialect.cjs";
import type { WithBuilder } from "../subquery.cjs";
import { WithSubquery } from "../../subquery.cjs";
import { MySqlSelectBuilder } from "./select.cjs";
import type { SelectedFields } from "./select.types.cjs";
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
