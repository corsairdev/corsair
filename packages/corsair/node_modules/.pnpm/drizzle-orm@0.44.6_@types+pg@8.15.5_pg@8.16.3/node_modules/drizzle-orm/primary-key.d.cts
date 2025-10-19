import { entityKind } from "./entity.cjs";
import type { AnyColumn } from "./column.cjs";
import type { Table } from "./table.cjs";
export declare abstract class PrimaryKey {
    readonly table: Table;
    readonly columns: AnyColumn[];
    static readonly [entityKind]: string;
    protected $brand: 'PrimaryKey';
    constructor(table: Table, columns: AnyColumn[]);
}
