import { entityKind } from "../entity.js";
import { type ColumnsSelection, View } from "../sql/sql.js";
export declare abstract class PgViewBase<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends View<TName, TExisting, TSelectedFields> {
    static readonly [entityKind]: string;
    readonly _: View<TName, TExisting, TSelectedFields>['_'] & {
        readonly viewBrand: 'PgViewBase';
    };
}
