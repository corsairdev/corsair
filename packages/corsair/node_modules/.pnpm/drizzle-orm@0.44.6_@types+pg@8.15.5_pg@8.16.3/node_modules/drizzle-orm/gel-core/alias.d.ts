import type { BuildAliasTable } from "./query-builders/select.types.js";
import type { GelTable } from "./table.js";
import type { GelViewBase } from "./view-base.js";
export declare function alias<TTable extends GelTable | GelViewBase, TAlias extends string>(table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
