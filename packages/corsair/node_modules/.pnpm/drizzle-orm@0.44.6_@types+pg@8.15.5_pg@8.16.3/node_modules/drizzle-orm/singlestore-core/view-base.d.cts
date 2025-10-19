import { entityKind } from "../entity.cjs";
import type { ColumnsSelection } from "../sql/sql.cjs";
import { View } from "../sql/sql.cjs";
export declare abstract class SingleStoreViewBase<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends View<TName, TExisting, TSelectedFields> {
    static readonly [entityKind]: string;
    readonly _: View<TName, TExisting, TSelectedFields>['_'] & {
        readonly viewBrand: 'SingleStoreViewBase';
    };
}
