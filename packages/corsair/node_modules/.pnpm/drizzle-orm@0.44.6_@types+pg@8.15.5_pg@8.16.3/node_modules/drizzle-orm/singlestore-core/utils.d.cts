import { SQL } from "../sql/sql.cjs";
import { Subquery } from "../subquery.cjs";
import type { Index } from "./indexes.cjs";
import type { PrimaryKey } from "./primary-keys.cjs";
import { SingleStoreTable } from "./table.cjs";
import { type UniqueConstraint } from "./unique-constraint.cjs";
export declare function extractUsedTable(table: SingleStoreTable | Subquery | SQL): string[];
export declare function getTableConfig(table: SingleStoreTable): {
    columns: import("./index.ts").SingleStoreColumn<import("../column.ts").ColumnBaseConfig<import("../column-builder.ts").ColumnDataType, string>, {}, {}>[];
    indexes: Index[];
    primaryKeys: PrimaryKey[];
    uniqueConstraints: UniqueConstraint[];
    name: string;
    schema: string | undefined;
    baseName: string;
};
