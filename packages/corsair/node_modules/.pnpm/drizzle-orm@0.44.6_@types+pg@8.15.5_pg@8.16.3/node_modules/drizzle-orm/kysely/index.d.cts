import type { ColumnType } from 'kysely';
import type { InferInsertModel, InferSelectModel, MapColumnName, Table } from "../table.cjs";
import type { Simplify } from "../utils.cjs";
export type Kyselify<T extends Table> = Simplify<{
    [Key in keyof T['_']['columns'] & string as MapColumnName<Key, T['_']['columns'][Key], true>]: ColumnType<InferSelectModel<T, {
        dbColumnNames: true;
    }>[MapColumnName<Key, T['_']['columns'][Key], true>], MapColumnName<Key, T['_']['columns'][Key], true> extends keyof InferInsertModel<T, {
        dbColumnNames: true;
    }> ? InferInsertModel<T, {
        dbColumnNames: true;
    }>[MapColumnName<Key, T['_']['columns'][Key], true>] : never, MapColumnName<Key, T['_']['columns'][Key], true> extends keyof InferInsertModel<T, {
        dbColumnNames: true;
    }> ? InferInsertModel<T, {
        dbColumnNames: true;
    }>[MapColumnName<Key, T['_']['columns'][Key], true>] : never>;
}>;
