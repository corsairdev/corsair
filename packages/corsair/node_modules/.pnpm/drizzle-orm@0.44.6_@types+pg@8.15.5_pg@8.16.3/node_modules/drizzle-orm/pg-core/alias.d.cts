import type { BuildAliasTable } from "./query-builders/select.types.cjs";
import type { PgTable } from "./table.cjs";
import type { PgViewBase } from "./view-base.cjs";
export declare function alias<TTable extends PgTable | PgViewBase, TAlias extends string>(table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
