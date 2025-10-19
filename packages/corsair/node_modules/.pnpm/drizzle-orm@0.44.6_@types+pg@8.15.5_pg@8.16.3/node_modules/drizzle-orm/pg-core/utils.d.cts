import { PgTable } from "./table.cjs";
import { SQL } from "../sql/sql.cjs";
import { Subquery } from "../subquery.cjs";
import { type Check } from "./checks.cjs";
import type { AnyPgColumn } from "./columns/index.cjs";
import { type ForeignKey } from "./foreign-keys.cjs";
import type { Index } from "./indexes.cjs";
import { PgPolicy } from "./policies.cjs";
import { type PrimaryKey } from "./primary-keys.cjs";
import { type UniqueConstraint } from "./unique-constraint.cjs";
import type { PgViewBase } from "./view-base.cjs";
import { type PgMaterializedView, type PgView } from "./view.cjs";
export declare function getTableConfig<TTable extends PgTable>(table: TTable): {
    columns: import("./index.ts").PgColumn<import("../column.ts").ColumnBaseConfig<import("../column-builder.ts").ColumnDataType, string>, {}, {}>[];
    indexes: Index[];
    foreignKeys: ForeignKey[];
    checks: Check[];
    primaryKeys: PrimaryKey[];
    uniqueConstraints: UniqueConstraint[];
    name: string;
    schema: string | undefined;
    policies: PgPolicy[];
    enableRLS: boolean;
};
export declare function extractUsedTable(table: PgTable | Subquery | PgViewBase | SQL): string[];
export declare function getViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: PgView<TName, TExisting>): {
    with?: import("./view.ts").ViewWithConfig;
    name: TName;
    originalName: TName;
    schema: string | undefined;
    selectedFields: import("../sql/sql.ts").ColumnsSelection;
    isExisting: TExisting;
    query: TExisting extends true ? undefined : SQL<unknown>;
    isAlias: boolean;
};
export declare function getMaterializedViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: PgMaterializedView<TName, TExisting>): {
    with?: import("./view.ts").PgMaterializedViewWithConfig;
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
export type ColumnsWithTable<TTableName extends string, TForeignTableName extends string, TColumns extends AnyPgColumn<{
    tableName: TTableName;
}>[]> = {
    [Key in keyof TColumns]: AnyPgColumn<{
        tableName: TForeignTableName;
    }>;
};
