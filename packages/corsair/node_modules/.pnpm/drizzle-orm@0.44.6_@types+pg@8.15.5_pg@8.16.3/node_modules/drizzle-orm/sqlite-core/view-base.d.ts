import { entityKind } from "../entity.js";
import type { ColumnsSelection } from "../sql/sql.js";
import { View } from "../sql/sql.js";
export declare abstract class SQLiteViewBase<TName extends string = string, TExisting extends boolean = boolean, TSelection extends ColumnsSelection = ColumnsSelection> extends View<TName, TExisting, TSelection> {
    static readonly [entityKind]: string;
    _: View<TName, TExisting, TSelection>['_'] & {
        viewBrand: 'SQLiteView';
    };
}
