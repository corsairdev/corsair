import type { BuildAliasTable } from "./query-builders/select.types.js";
import type { PgTable } from "./table.js";
import type { PgViewBase } from "./view-base.js";
export declare function alias<TTable extends PgTable | PgViewBase, TAlias extends string>(table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
