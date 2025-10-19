import { entityKind } from "../entity.js";
import type { ColumnsSelection } from "../sql/sql.js";
import { View } from "../sql/sql.js";
export declare abstract class MySqlViewBase<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends View<TName, TExisting, TSelectedFields> {
    static readonly [entityKind]: string;
    readonly _: View<TName, TExisting, TSelectedFields>['_'] & {
        readonly viewBrand: 'MySqlViewBase';
    };
}
