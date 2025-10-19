import { entityKind } from "../../entity.js";
import type { SQLiteDialectConfig } from "../dialect.js";
import { SQLiteDialect } from "../dialect.js";
import type { WithBuilder } from "../subquery.js";
import { WithSubquery } from "../../subquery.js";
import { SQLiteSelectBuilder } from "./select.js";
import type { SelectedFields } from "./select.types.js";
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
