import { SQL } from "../sql/sql.cjs";
import { Subquery } from "../subquery.cjs";
import { type Check } from "./checks.cjs";
import type { AnyGelColumn } from "./columns/index.cjs";
import { type ForeignKey } from "./foreign-keys.cjs";
import type { Index } from "./indexes.cjs";
import { GelPolicy } from "./policies.cjs";
import { type PrimaryKey } from "./primary-keys.cjs";
import { GelTable } from "./table.cjs";
import { type UniqueConstraint } from "./unique-constraint.cjs";
import type { GelViewBase } from "./view-base.cjs";
import { type GelMaterializedView, type GelView } from "./view.cjs";
export declare function getTableConfig<TTable extends GelTable>(table: TTable): {
    columns: import("./index.ts").GelColumn<import("../column.ts").ColumnBaseConfig<import("../column-builder.ts").ColumnDataType, string>, {}, {}>[];
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
    with?: import("./view.ts").ViewWithConfig;
    name: TName;
    originalName: TName;
    schema: string | undefined;
    selectedFields: import("../sql/sql.ts").ColumnsSelection;
    isExisting: TExisting;
    query: TExisting extends true ? undefined : SQL<unknown>;
    isAlias: boolean;
};
export declare function getMaterializedViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: GelMaterializedView<TName, TExisting>): {
    with?: import("./view.ts").GelMaterializedViewWithConfig;
    using?: string;
    tablespace?: string;
    withNoData?: boolean;
    name: TName;
    originalName: TName;
    schema: string | undefined;
    selectedFields: import("../sql/sql.ts").ColumnsSelection;
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
