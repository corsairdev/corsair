import type { BuildAliasTable } from "./query-builders/select.types.js";
import type { SingleStoreTable } from "./table.js";
export declare function alias<TTable extends SingleStoreTable, TAlias extends string>(// | SingleStoreViewBase
table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
