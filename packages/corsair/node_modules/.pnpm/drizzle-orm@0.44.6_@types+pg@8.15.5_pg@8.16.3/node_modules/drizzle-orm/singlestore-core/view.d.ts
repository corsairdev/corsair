import type { BuildColumns } from "../column-builder.js";
import { entityKind } from "../entity.js";
import type { TypedQueryBuilder } from "../query-builders/query-builder.js";
import type { AddAliasToSelection } from "../query-builders/select.types.js";
import type { ColumnsSelection, SQL } from "../sql/sql.js";
import type { SingleStoreColumnBuilderBase } from "./columns/index.js";
import { QueryBuilder } from "./query-builders/query-builder.js";
import type { SelectedFields } from "./query-builders/select.types.js";
import { SingleStoreViewBase } from "./view-base.js";
import { SingleStoreViewConfig } from "./view-common.js";
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
    protected schema: string | undefined;
    static readonly [entityKind]: string;
    readonly _: {
        readonly name: TConfig['name'];
        readonly columns: TConfig['columns'];
    };
    constructor(name: TConfig['name'], schema: string | undefined);
    protected config: ViewBuilderConfig;
    algorithm(algorithm: Exclude<ViewBuilderConfig['algorithm'], undefined>): this;
    definer(definer: Exclude<ViewBuilderConfig['definer'], undefined>): this;
    sqlSecurity(sqlSecurity: Exclude<ViewBuilderConfig['sqlSecurity'], undefined>): this;
    withCheckOption(withCheckOption?: Exclude<ViewBuilderConfig['withCheckOption'], undefined>): this;
}
export declare class ViewBuilder<TName extends string = string> extends ViewBuilderCore<{
    name: TName;
}> {
    static readonly [entityKind]: string;
    as<TSelectedFields extends SelectedFields>(qb: TypedQueryBuilder<TSelectedFields> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelectedFields>)): SingleStoreViewWithSelection<TName, false, AddAliasToSelection<TSelectedFields, TName, 'singlestore'>>;
}
export declare class ManualViewBuilder<TName extends string = string, TColumns extends Record<string, SingleStoreColumnBuilderBase> = Record<string, SingleStoreColumnBuilderBase>> extends ViewBuilderCore<{
    name: TName;
    columns: TColumns;
}> {
    static readonly [entityKind]: string;
    private columns;
    constructor(name: TName, columns: TColumns, schema: string | undefined);
    existing(): SingleStoreViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'singlestore'>>;
    as(query: SQL): SingleStoreViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'singlestore'>>;
}
export declare class SingleStoreView<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends SingleStoreViewBase<TName, TExisting, TSelectedFields> {
    static readonly [entityKind]: string;
    protected $SingleStoreViewBrand: 'SingleStoreView';
    [SingleStoreViewConfig]: ViewBuilderConfig | undefined;
    constructor({ singlestoreConfig, config }: {
        singlestoreConfig: ViewBuilderConfig | undefined;
        config: {
            name: TName;
            schema: string | undefined;
            selectedFields: SelectedFields;
            query: SQL | undefined;
        };
    });
}
export type SingleStoreViewWithSelection<TName extends string, TExisting extends boolean, TSelectedFields extends ColumnsSelection> = SingleStoreView<TName, TExisting, TSelectedFields> & TSelectedFields;
