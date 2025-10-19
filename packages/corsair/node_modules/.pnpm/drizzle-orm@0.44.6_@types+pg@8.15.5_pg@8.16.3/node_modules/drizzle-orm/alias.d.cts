import type { AnyColumn } from "./column.cjs";
import { Column } from "./column.cjs";
import { entityKind } from "./entity.cjs";
import type { Relation } from "./relations.cjs";
import type { View } from "./sql/sql.cjs";
import { SQL } from "./sql/sql.cjs";
import { Table } from "./table.cjs";
export declare class ColumnAliasProxyHandler<TColumn extends Column> implements ProxyHandler<TColumn> {
    private table;
    static readonly [entityKind]: string;
    constructor(table: Table | View);
    get(columnObj: TColumn, prop: string | symbol): any;
}
export declare class TableAliasProxyHandler<T extends Table | View> implements ProxyHandler<T> {
    private alias;
    private replaceOriginalName;
    static readonly [entityKind]: string;
    constructor(alias: string, replaceOriginalName: boolean);
    get(target: T, prop: string | symbol): any;
}
export declare class RelationTableAliasProxyHandler<T extends Relation> implements ProxyHandler<T> {
    private alias;
    static readonly [entityKind]: string;
    constructor(alias: string);
    get(target: T, prop: string | symbol): any;
}
export declare function aliasedTable<T extends Table | View>(table: T, tableAlias: string): T;
export declare function aliasedRelation<T extends Relation>(relation: T, tableAlias: string): T;
export declare function aliasedTableColumn<T extends AnyColumn>(column: T, tableAlias: string): T;
export declare function mapColumnsInAliasedSQLToAlias(query: SQL.Aliased, alias: string): SQL.Aliased;
export declare function mapColumnsInSQLToAlias(query: SQL, alias: string): SQL;
