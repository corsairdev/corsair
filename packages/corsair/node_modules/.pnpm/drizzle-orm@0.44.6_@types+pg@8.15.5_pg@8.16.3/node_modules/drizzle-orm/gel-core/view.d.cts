import type { BuildColumns } from "../column-builder.cjs";
import { entityKind } from "../entity.cjs";
import type { TypedQueryBuilder } from "../query-builders/query-builder.cjs";
import type { AddAliasToSelection } from "../query-builders/select.types.cjs";
import type { ColumnsSelection, SQL } from "../sql/sql.cjs";
import type { RequireAtLeastOne } from "../utils.cjs";
import type { GelColumnBuilderBase } from "./columns/common.cjs";
import { QueryBuilder } from "./query-builders/query-builder.cjs";
import { GelViewBase } from "./view-base.cjs";
import { GelViewConfig } from "./view-common.cjs";
export type ViewWithConfig = RequireAtLeastOne<{
    checkOption: 'local' | 'cascaded';
    securityBarrier: boolean;
    securityInvoker: boolean;
}>;
export declare class DefaultViewBuilderCore<TConfig extends {
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
    protected config: {
        with?: ViewWithConfig;
    };
    with(config: ViewWithConfig): this;
}
export declare class ViewBuilder<TName extends string = string> extends DefaultViewBuilderCore<{
    name: TName;
}> {
    static readonly [entityKind]: string;
    as<TSelectedFields extends ColumnsSelection>(qb: TypedQueryBuilder<TSelectedFields> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelectedFields>)): GelViewWithSelection<TName, false, AddAliasToSelection<TSelectedFields, TName, 'gel'>>;
}
export declare class ManualViewBuilder<TName extends string = string, TColumns extends Record<string, GelColumnBuilderBase> = Record<string, GelColumnBuilderBase>> extends DefaultViewBuilderCore<{
    name: TName;
    columns: TColumns;
}> {
    static readonly [entityKind]: string;
    private columns;
    constructor(name: TName, columns: TColumns, schema: string | undefined);
    existing(): GelViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'gel'>>;
    as(query: SQL): GelViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'gel'>>;
}
export type GelMaterializedViewWithConfig = RequireAtLeastOne<{
    fillfactor: number;
    toastTupleTarget: number;
    parallelWorkers: number;
    autovacuumEnabled: boolean;
    vacuumIndexCleanup: 'auto' | 'off' | 'on';
    vacuumTruncate: boolean;
    autovacuumVacuumThreshold: number;
    autovacuumVacuumScaleFactor: number;
    autovacuumVacuumCostDelay: number;
    autovacuumVacuumCostLimit: number;
    autovacuumFreezeMinAge: number;
    autovacuumFreezeMaxAge: number;
    autovacuumFreezeTableAge: number;
    autovacuumMultixactFreezeMinAge: number;
    autovacuumMultixactFreezeMaxAge: number;
    autovacuumMultixactFreezeTableAge: number;
    logAutovacuumMinDuration: number;
    userCatalogTable: boolean;
}>;
export declare class MaterializedViewBuilderCore<TConfig extends {
    name: string;
    columns?: unknown;
}> {
    protected name: TConfig['name'];
    protected schema: string | undefined;
    static readonly [entityKind]: string;
    _: {
        readonly name: TConfig['name'];
        readonly columns: TConfig['columns'];
    };
    constructor(name: TConfig['name'], schema: string | undefined);
    protected config: {
        with?: GelMaterializedViewWithConfig;
        using?: string;
        tablespace?: string;
        withNoData?: boolean;
    };
    using(using: string): this;
    with(config: GelMaterializedViewWithConfig): this;
    tablespace(tablespace: string): this;
    withNoData(): this;
}
export declare class MaterializedViewBuilder<TName extends string = string> extends MaterializedViewBuilderCore<{
    name: TName;
}> {
    static readonly [entityKind]: string;
    as<TSelectedFields extends ColumnsSelection>(qb: TypedQueryBuilder<TSelectedFields> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelectedFields>)): GelMaterializedViewWithSelection<TName, false, AddAliasToSelection<TSelectedFields, TName, 'gel'>>;
}
export declare class ManualMaterializedViewBuilder<TName extends string = string, TColumns extends Record<string, GelColumnBuilderBase> = Record<string, GelColumnBuilderBase>> extends MaterializedViewBuilderCore<{
    name: TName;
    columns: TColumns;
}> {
    static readonly [entityKind]: string;
    private columns;
    constructor(name: TName, columns: TColumns, schema: string | undefined);
    existing(): GelMaterializedViewWithSelection<TName, true, BuildColumns<TName, TColumns, 'gel'>>;
    as(query: SQL): GelMaterializedViewWithSelection<TName, false, BuildColumns<TName, TColumns, 'gel'>>;
}
export declare class GelView<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends GelViewBase<TName, TExisting, TSelectedFields> {
    static readonly [entityKind]: string;
    [GelViewConfig]: {
        with?: ViewWithConfig;
    } | undefined;
    constructor({ GelConfig, config }: {
        GelConfig: {
            with?: ViewWithConfig;
        } | undefined;
        config: {
            name: TName;
            schema: string | undefined;
            selectedFields: ColumnsSelection;
            query: SQL | undefined;
        };
    });
}
export type GelViewWithSelection<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> = GelView<TName, TExisting, TSelectedFields> & TSelectedFields;
export declare const GelMaterializedViewConfig: unique symbol;
export declare class GelMaterializedView<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends GelViewBase<TName, TExisting, TSelectedFields> {
    static readonly [entityKind]: string;
    readonly [GelMaterializedViewConfig]: {
        readonly with?: GelMaterializedViewWithConfig;
        readonly using?: string;
        readonly tablespace?: string;
        readonly withNoData?: boolean;
    } | undefined;
    constructor({ GelConfig, config }: {
        GelConfig: {
            with: GelMaterializedViewWithConfig | undefined;
            using: string | undefined;
            tablespace: string | undefined;
            withNoData: boolean | undefined;
        } | undefined;
        config: {
            name: TName;
            schema: string | undefined;
            selectedFields: ColumnsSelection;
            query: SQL | undefined;
        };
    });
}
export type GelMaterializedViewWithSelection<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> = GelMaterializedView<TName, TExisting, TSelectedFields> & TSelectedFields;
