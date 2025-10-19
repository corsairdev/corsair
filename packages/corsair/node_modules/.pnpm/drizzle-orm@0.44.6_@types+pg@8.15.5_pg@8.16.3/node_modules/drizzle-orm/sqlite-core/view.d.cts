import type { BuildColumns } from "../column-builder.cjs";
import { entityKind } from "../entity.cjs";
import type { TypedQueryBuilder } from "../query-builders/query-builder.cjs";
import type { AddAliasToSelection } from "../query-builders/select.types.cjs";
import type { ColumnsSelection, SQL } from "../sql/sql.cjs";
import type { SQLiteColumnBuilderBase } from "./columns/common.cjs";
import { QueryBuilder } from "./query-builders/query-builder.cjs";
import { SQLiteViewBase } from "./view-base.cjs";
export interface ViewBuilderConfig {
    algorithm?: 'undefined' | 'merge' | 'temptable';
    definer?: string;
    sqlSecurity?: 'definer' | 'invoker';
    withCheckOption?: 'cascaded' | 'local';
}
export declare class ViewBuilderCore<TConfig extends {
    name: string;
    columns?: unknown;
}> {
    protected name: TConfig['name'];
    static readonly [entityKind]: string;
    readonly _: {
        readonly name: TConfig['name'];
        readonly columns: TConfig['columns'];
    };
    constructor(name: TConfig['name']);
    protected config: ViewBuilderConfig;
}
export declare class ViewBuilder<TName extends string = string> extends ViewBuilderCore<{
    name: TName;
}> {
    static readonly [entityKind]: string;
    as<TSelection extends ColumnsSelection>(qb: TypedQueryBuilder<TSelection> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelection>)): SQLiteViewWithSelection<TName, false, AddAliasToSelection<TSelection, TName, 'sqlite'>>;
}
export declare class ManualViewBuilder<TName extends string = string, TColumns extends Record<string, SQLiteColumnBuilderBase> = Record<string, SQLiteColumnBuilderBase>> extends ViewBuilderCore<{
    name: TName;
    columns: TColumns;
}> {
    static readonly [entityKind]: string;
    private columns;
    constructor(name: TName, columns: TColumns);
    existing(): SQLiteViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'sqlite'>>;
    as(query: SQL): SQLiteViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'sqlite'>>;
}
export declare class SQLiteView<TName extends string = string, TExisting extends boolean = boolean, TSelection extends ColumnsSelection = ColumnsSelection> extends SQLiteViewBase<TName, TExisting, TSelection> {
    static readonly [entityKind]: string;
    constructor({ config }: {
        config: {
            name: TName;
            schema: string | undefined;
            selectedFields: ColumnsSelection;
            query: SQL | undefined;
        };
    });
}
export type SQLiteViewWithSelection<TName extends string, TExisting extends boolean, TSelection extends ColumnsSelection> = SQLiteView<TName, TExisting, TSelection> & TSelection;
export declare function sqliteView<TName extends string>(name: TName): ViewBuilder<TName>;
export declare function sqliteView<TName extends string, TColumns extends Record<string, SQLiteColumnBuilderBase>>(name: TName, columns: TColumns): ManualViewBuilder<TName, TColumns>;
export declare const view: typeof sqliteView;
