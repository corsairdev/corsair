import type { BuildAliasTable } from "./query-builders/select.types.cjs";
import type { SingleStoreTable } from "./table.cjs";
export declare function alias<TTable extends SingleStoreTable, TAlias extends string>(// | SingleStoreViewBase
table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
