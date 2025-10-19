import type { BuildAliasTable } from "./query-builders/select.types.js";
import type { SQLiteTable } from "./table.js";
import type { SQLiteViewBase } from "./view-base.js";
export declare function alias<TTable extends SQLiteTable | SQLiteViewBase, TAlias extends string>(table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
