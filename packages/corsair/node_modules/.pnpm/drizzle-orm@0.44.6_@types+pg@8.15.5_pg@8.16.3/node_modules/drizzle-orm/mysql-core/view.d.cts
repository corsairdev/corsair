import type { BuildColumns } from "../column-builder.cjs";
import { entityKind } from "../entity.cjs";
import type { TypedQueryBuilder } from "../query-builders/query-builder.cjs";
import type { AddAliasToSelection } from "../query-builders/select.types.cjs";
import type { ColumnsSelection, SQL } from "../sql/sql.cjs";
import type { MySqlColumnBuilderBase } from "./columns/index.cjs";
import { QueryBuilder } from "./query-builders/query-builder.cjs";
import { MySqlViewBase } from "./view-base.cjs";
import { MySqlViewConfig } from "./view-common.cjs";
export interface ViewBuilderConfig {
    algorithm?: 'undefined' | 'merge' | 'temptable';
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
    sqlSecurity(sqlSecurity: Exclude<ViewBuilderConfig['sqlSecurity'], undefined>): this;
    withCheckOption(withCheckOption?: Exclude<ViewBuilderConfig['withCheckOption'], undefined>): this;
}
export declare class ViewBuilder<TName extends string = string> extends ViewBuilderCore<{
    name: TName;
}> {
    static readonly [entityKind]: string;
    as<TSelectedFields extends ColumnsSelection>(qb: TypedQueryBuilder<TSelectedFields> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelectedFields>)): MySqlViewWithSelection<TName, false, AddAliasToSelection<TSelectedFields, TName, 'mysql'>>;
}
export declare class ManualViewBuilder<TName extends string = string, TColumns extends Record<string, MySqlColumnBuilderBase> = Record<string, MySqlColumnBuilderBase>> extends ViewBuilderCore<{
    name: TName;
    columns: TColumns;
}> {
    static readonly [entityKind]: string;
    private columns;
    constructor(name: TName, columns: TColumns, schema: string | undefined);
    existing(): MySqlViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'mysql'>>;
    as(query: SQL): MySqlViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'mysql'>>;
}
export declare class MySqlView<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends MySqlViewBase<TName, TExisting, TSelectedFields> {
    static readonly [entityKind]: string;
    protected $MySqlViewBrand: 'MySqlView';
    [MySqlViewConfig]: ViewBuilderConfig | undefined;
    constructor({ mysqlConfig, config }: {
        mysqlConfig: ViewBuilderConfig | undefined;
        config: {
            name: TName;
            schema: string | undefined;
            selectedFields: ColumnsSelection;
            query: SQL | undefined;
        };
    });
}
export type MySqlViewWithSelection<TName extends string, TExisting extends boolean, TSelectedFields extends ColumnsSelection> = MySqlView<TName, TExisting, TSelectedFields> & TSelectedFields;
export declare function mysqlView<TName extends string>(name: TName): ViewBuilder<TName>;
export declare function mysqlView<TName extends string, TColumns extends Record<string, MySqlColumnBuilderBase>>(name: TName, columns: TColumns): ManualViewBuilder<TName, TColumns>;
