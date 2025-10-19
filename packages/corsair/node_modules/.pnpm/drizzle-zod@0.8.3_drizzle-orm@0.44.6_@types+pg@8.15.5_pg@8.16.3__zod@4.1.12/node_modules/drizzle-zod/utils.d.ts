import type { Column, SelectedFieldsFlat, Table, View } from 'drizzle-orm';
import type { PgEnum } from 'drizzle-orm/pg-core';
import type { z } from 'zod/v4';
import type { literalSchema } from './column.js';
export declare function isColumnType<T extends Column>(column: Column, columnTypes: string[]): column is T;
export declare function isWithEnum(column: Column): column is typeof column & {
    enumValues: [string, ...string[]];
};
export declare const isPgEnum: (entity: any) => entity is PgEnum<[string, ...string[]]>;
type Literal = z.infer<typeof literalSchema>;
export type Json = Literal | {
    [key: string]: any;
} | any[];
export type IsNever<T> = [T] extends [never] ? true : false;
export type IsEnumDefined<TEnum extends string[] | undefined> = [string, ...string[]] extends TEnum ? false : undefined extends TEnum ? false : true;
export type ColumnIsGeneratedAlwaysAs<TColumn> = TColumn extends Column ? TColumn['_']['identity'] extends 'always' ? true : TColumn['_']['generated'] extends {
    type: 'byDefault';
} | undefined ? false : true : false;
export type GetSelection<T extends SelectedFieldsFlat<Column> | Table | View> = T extends Table ? T['_']['columns'] : T extends View ? T['_']['selectedFields'] : T;
export {};
