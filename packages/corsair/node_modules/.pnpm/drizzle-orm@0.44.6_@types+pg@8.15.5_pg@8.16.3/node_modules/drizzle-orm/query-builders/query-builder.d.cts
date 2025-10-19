import { entityKind } from "../entity.cjs";
import type { SQL, SQLWrapper } from "../sql/index.cjs";
export declare abstract class TypedQueryBuilder<TSelection, TResult = unknown, TConfig = unknown> implements SQLWrapper {
    static readonly [entityKind]: string;
    _: {
        selectedFields: TSelection;
        result: TResult;
        config?: TConfig;
    };
    abstract getSQL(): SQL;
}
