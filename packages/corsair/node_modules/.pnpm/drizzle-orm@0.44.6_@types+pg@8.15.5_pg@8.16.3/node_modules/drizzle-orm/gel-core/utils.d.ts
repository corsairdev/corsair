import { SQL } from "../sql/sql.js";
import { Subquery } from "../subquery.js";
import { type Check } from "./checks.js";
import type { AnyGelColumn } from "./columns/index.js";
import { type ForeignKey } from "./foreign-keys.js";
import type { Index } from "./indexes.js";
import { GelPolicy } from "./policies.js";
import { type PrimaryKey } from "./primary-keys.js";
import { GelTable } from "./table.js";
import { type UniqueConstraint } from "./unique-constraint.js";
import type { GelViewBase } from "./view-base.js";
import { type GelMaterializedView, type GelView } from "./view.js";
export declare function getTableConfig<TTable extends GelTable>(table: TTable): {
    columns: import("./index.js").GelColumn<import("../column.js").ColumnBaseConfig<import("../column-builder.js").ColumnDataType, string>, {}, {}>[];
    indexes: Index[];
    foreignKeys: ForeignKey[];
    checks: Check[];
    primaryKeys: PrimaryKey[];
    uniqueConstraints: UniqueConstraint[];
    name: string;
    schema: string | undefined;
    policies: GelPolicy[];
    enableRLS: boolean;
};
export declare function extractUsedTable(table: GelTable | Subquery | GelViewBase | SQL): string[];
export declare function getViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: GelView<TName, TExisting>): {
    with?: import("./view.js").ViewWithConfig;
    name: TName;
    originalName: TName;
    schema: string | undefined;
    selectedFields: import("../sql/sql.js").ColumnsSelection;
    isExisting: TExisting;
    query: TExisting extends true ? undefined : SQL<unknown>;
    isAlias: boolean;
};
export declare function getMaterializedViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: GelMaterializedView<TName, TExisting>): {
    with?: import("./view.js").GelMaterializedViewWithConfig;
    using?: string;
    tablespace?: string;
    withNoData?: boolean;
    name: TName;
    originalName: TName;
    schema: string | undefined;
    selectedFields: import("../sql/sql.js").ColumnsSelection;
    isExisting: TExisting;
    query: TExisting extends true ? undefined : SQL<unknown>;
    isAlias: boolean;
};
export type ColumnsWithTable<TTableName extends string, TForeignTableName extends string, TColumns extends AnyGelColumn<{
    tableName: TTableName;
}>[]> = {
    [Key in keyof TColumns]: AnyGelColumn<{
        tableName: TForeignTableName;
    }>;
};
