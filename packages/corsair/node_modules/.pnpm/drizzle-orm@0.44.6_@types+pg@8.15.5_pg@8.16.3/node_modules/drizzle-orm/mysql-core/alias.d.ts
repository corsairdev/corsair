import type { BuildAliasTable } from "./query-builders/select.types.js";
import type { MySqlTable } from "./table.js";
import type { MySqlViewBase } from "./view-base.js";
export declare function alias<TTable extends MySqlTable | MySqlViewBase, TAlias extends string>(table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
