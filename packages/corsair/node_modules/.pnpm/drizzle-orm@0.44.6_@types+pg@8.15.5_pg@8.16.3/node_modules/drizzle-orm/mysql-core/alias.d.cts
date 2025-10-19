import type { BuildAliasTable } from "./query-builders/select.types.cjs";
import type { MySqlTable } from "./table.cjs";
import type { MySqlViewBase } from "./view-base.cjs";
export declare function alias<TTable extends MySqlTable | MySqlViewBase, TAlias extends string>(table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
