import { SQL } from "../sql/sql.js";
import { Subquery } from "../subquery.js";
import type { Index } from "./indexes.js";
import type { PrimaryKey } from "./primary-keys.js";
import { SingleStoreTable } from "./table.js";
import { type UniqueConstraint } from "./unique-constraint.js";
export declare function extractUsedTable(table: SingleStoreTable | Subquery | SQL): string[];
export declare function getTableConfig(table: SingleStoreTable): {
    columns: import("./index.js").SingleStoreColumn<import("../column.js").ColumnBaseConfig<import("../column-builder.js").ColumnDataType, string>, {}, {}>[];
    indexes: Index[];
    primaryKeys: PrimaryKey[];
    uniqueConstraints: UniqueConstraint[];
    name: string;
    schema: string | undefined;
    baseName: string;
};
