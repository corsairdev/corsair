import { entityKind } from "./entity.js";
import type { AnyColumn } from "./column.js";
import type { Table } from "./table.js";
export declare abstract class PrimaryKey {
    readonly table: Table;
    readonly columns: AnyColumn[];
    static readonly [entityKind]: string;
    protected $brand: 'PrimaryKey';
    constructor(table: Table, columns: AnyColumn[]);
}
