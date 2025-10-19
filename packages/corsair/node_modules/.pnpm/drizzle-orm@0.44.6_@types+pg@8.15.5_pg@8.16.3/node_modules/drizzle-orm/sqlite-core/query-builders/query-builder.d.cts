import { entityKind } from "../../entity.cjs";
import type { SQLiteDialectConfig } from "../dialect.cjs";
import { SQLiteDialect } from "../dialect.cjs";
import type { WithBuilder } from "../subquery.cjs";
import { WithSubquery } from "../../subquery.cjs";
import { SQLiteSelectBuilder } from "./select.cjs";
import type { SelectedFields } from "./select.types.cjs";
export declare class QueryBuilder {
    static readonly [entityKind]: string;
    private dialect;
    private dialectConfig;
    constructor(dialect?: SQLiteDialect | SQLiteDialectConfig);
    $with: WithBuilder;
    with(...queries: WithSubquery[]): {
        select: {
            (): SQLiteSelectBuilder<undefined, "sync", void, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, "sync", void, "qb">;
        };
        selectDistinct: {
            (): SQLiteSelectBuilder<undefined, "sync", void, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, "sync", void, "qb">;
        };
    };
    select(): SQLiteSelectBuilder<undefined, 'sync', void, 'qb'>;
    select<TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, 'sync', void, 'qb'>;
    selectDistinct(): SQLiteSelectBuilder<undefined, 'sync', void, 'qb'>;
    selectDistinct<TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, 'sync', void, 'qb'>;
    private getDialect;
}
