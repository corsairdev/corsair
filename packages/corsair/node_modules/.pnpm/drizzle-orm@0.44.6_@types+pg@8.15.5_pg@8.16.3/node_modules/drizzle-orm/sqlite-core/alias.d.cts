import type { BuildAliasTable } from "./query-builders/select.types.cjs";
import type { SQLiteTable } from "./table.cjs";
import type { SQLiteViewBase } from "./view-base.cjs";
export declare function alias<TTable extends SQLiteTable | SQLiteViewBase, TAlias extends string>(table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
