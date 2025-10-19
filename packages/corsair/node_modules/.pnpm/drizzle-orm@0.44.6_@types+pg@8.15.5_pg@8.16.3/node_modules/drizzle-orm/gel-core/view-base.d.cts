import { entityKind } from "../entity.cjs";
import { type ColumnsSelection, View } from "../sql/sql.cjs";
export declare abstract class GelViewBase<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends View<TName, TExisting, TSelectedFields> {
    static readonly [entityKind]: string;
    readonly _: View<TName, TExisting, TSelectedFields>['_'] & {
        readonly viewBrand: 'GelViewBase';
    };
}
