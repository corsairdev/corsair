import { entityKind } from "../entity.js";
import type { AnyGelColumn, GelColumn } from "./columns/index.js";
import type { GelTable } from "./table.js";
export type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export type Reference = () => {
    readonly name?: string;
    readonly columns: GelColumn[];
    readonly foreignTable: GelTable;
    readonly foreignColumns: GelColumn[];
};
export declare class ForeignKeyBuilder {
    static readonly [entityKind]: string;
    constructor(config: () => {
        name?: string;
        columns: GelColumn[];
        foreignColumns: GelColumn[];
    }, actions?: {
        onUpdate?: UpdateDeleteAction;
        onDelete?: UpdateDeleteAction;
    } | undefined);
    onUpdate(action: UpdateDeleteAction): this;
    onDelete(action: UpdateDeleteAction): this;
}
export type AnyForeignKeyBuilder = ForeignKeyBuilder;
export declare class ForeignKey {
    readonly table: GelTable;
    static readonly [entityKind]: string;
    readonly reference: Reference;
    readonly onUpdate: UpdateDeleteAction | undefined;
    readonly onDelete: UpdateDeleteAction | undefined;
    constructor(table: GelTable, builder: ForeignKeyBuilder);
    getName(): string;
}
type ColumnsWithTable<TTableName extends string, TColumns extends GelColumn[]> = {
    [Key in keyof TColumns]: AnyGelColumn<{
        tableName: TTableName;
    }>;
};
export declare function foreignKey<TTableName extends string, TForeignTableName extends string, TColumns extends [AnyGelColumn<{
    tableName: TTableName;
}>, ...AnyGelColumn<{
    tableName: TTableName;
}>[]]>(config: {
    name?: string;
    columns: TColumns;
    foreignColumns: ColumnsWithTable<TForeignTableName, TColumns>;
}): ForeignKeyBuilder;
export {};
