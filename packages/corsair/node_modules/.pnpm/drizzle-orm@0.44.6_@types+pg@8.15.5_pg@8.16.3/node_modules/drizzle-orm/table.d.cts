import type { Column, GetColumnData } from "./column.cjs";
import { entityKind } from "./entity.cjs";
import type { OptionalKeyOnly, RequiredKeyOnly } from "./operations.cjs";
import type { SQLWrapper } from "./sql/sql.cjs";
import type { Simplify, Update } from "./utils.cjs";
export interface TableConfig<TColumn extends Column = Column<any>> {
    name: string;
    schema: string | undefined;
    columns: Record<string, TColumn>;
    dialect: string;
}
export type UpdateTableConfig<T extends TableConfig, TUpdate extends Partial<TableConfig>> = Required<Update<T, TUpdate>>;
export interface Table<T extends TableConfig = TableConfig> extends SQLWrapper {
}
export declare class Table<T extends TableConfig = TableConfig> implements SQLWrapper {
    static readonly [entityKind]: string;
    readonly _: {
        readonly brand: 'Table';
        readonly config: T;
        readonly name: T['name'];
        readonly schema: T['schema'];
        readonly columns: T['columns'];
        readonly inferSelect: InferSelectModel<Table<T>>;
        readonly inferInsert: InferInsertModel<Table<T>>;
    };
    readonly $inferSelect: InferSelectModel<Table<T>>;
    readonly $inferInsert: InferInsertModel<Table<T>>;
    constructor(name: string, schema: string | undefined, baseName: string);
}
export declare function isTable(table: unknown): table is Table;
/**
 * Any table with a specified boundary.
 *
 * @example
    ```ts
    // Any table with a specific name
    type AnyUsersTable = AnyTable<{ name: 'users' }>;
    ```
 *
 * To describe any table with any config, simply use `Table` without any type arguments, like this:
 *
    ```ts
    function needsTable(table: Table) {
        ...
    }
    ```
 */
export type AnyTable<TPartial extends Partial<TableConfig>> = Table<UpdateTableConfig<TableConfig, TPartial>>;
export declare function getTableName<T extends Table>(table: T): T['_']['name'];
export declare function getTableUniqueName<T extends Table>(table: T): `${T['_']['schema']}.${T['_']['name']}`;
export type MapColumnName<TName extends string, TColumn extends Column, TDBColumNames extends boolean> = TDBColumNames extends true ? TColumn['_']['name'] : TName;
export type InferModelFromColumns<TColumns extends Record<string, Column>, TInferMode extends 'select' | 'insert' = 'select', TConfig extends {
    dbColumnNames: boolean;
    override?: boolean;
} = {
    dbColumnNames: false;
    override: false;
}> = Simplify<TInferMode extends 'insert' ? {
    [Key in keyof TColumns & string as RequiredKeyOnly<MapColumnName<Key, TColumns[Key], TConfig['dbColumnNames']>, TColumns[Key]>]: GetColumnData<TColumns[Key], 'query'>;
} & {
    [Key in keyof TColumns & string as OptionalKeyOnly<MapColumnName<Key, TColumns[Key], TConfig['dbColumnNames']>, TColumns[Key], TConfig['override']>]?: GetColumnData<TColumns[Key], 'query'> | undefined;
} : {
    [Key in keyof TColumns & string as MapColumnName<Key, TColumns[Key], TConfig['dbColumnNames']>]: GetColumnData<TColumns[Key], 'query'>;
}>;
/** @deprecated Use one of the alternatives: {@link InferSelectModel} / {@link InferInsertModel}, or `table.$inferSelect` / `table.$inferInsert`
 */
export type InferModel<TTable extends Table, TInferMode extends 'select' | 'insert' = 'select', TConfig extends {
    dbColumnNames: boolean;
} = {
    dbColumnNames: false;
}> = InferModelFromColumns<TTable['_']['columns'], TInferMode, TConfig>;
export type InferSelectModel<TTable extends Table, TConfig extends {
    dbColumnNames: boolean;
} = {
    dbColumnNames: false;
}> = InferModelFromColumns<TTable['_']['columns'], 'select', TConfig>;
export type InferInsertModel<TTable extends Table, TConfig extends {
    dbColumnNames: boolean;
    override?: boolean;
} = {
    dbColumnNames: false;
    override: false;
}> = InferModelFromColumns<TTable['_']['columns'], 'insert', TConfig>;
export type InferEnum<T> = T extends {
    enumValues: readonly (infer U)[];
} ? U : never;
