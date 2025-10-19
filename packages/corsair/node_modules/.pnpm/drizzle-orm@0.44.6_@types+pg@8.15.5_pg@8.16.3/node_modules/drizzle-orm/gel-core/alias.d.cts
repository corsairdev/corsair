import type { BuildAliasTable } from "./query-builders/select.types.cjs";
import type { GelTable } from "./table.cjs";
import type { GelViewBase } from "./view-base.cjs";
export declare function alias<TTable extends GelTable | GelViewBase, TAlias extends string>(table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
