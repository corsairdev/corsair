import type { Cache } from "./cache/core/cache.cjs";
import type { AnyColumn } from "./column.cjs";
import type { Logger } from "./logger.cjs";
import { Param, SQL, View } from "./sql/sql.cjs";
import { Table } from "./table.cjs";
export declare function haveSameKeys(left: Record<string, unknown>, right: Record<string, unknown>): boolean;
export type UpdateSet = Record<string, SQL | Param | AnyColumn | null | undefined>;
export type OneOrMany<T> = T | T[];
export type Update<T, TUpdate> = {
    [K in Exclude<keyof T, keyof TUpdate>]: T[K];
} & TUpdate;
export type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};
export type SimplifyMappedType<T> = [T] extends [unknown] ? T : never;
export type ShallowRecord<K extends keyof any, T> = SimplifyMappedType<{
    [P in K]: T;
}>;
export type Assume<T, U> = T extends U ? T : U;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
export interface DrizzleTypeError<T extends string> {
    $drizzleTypeError: T;
}
export type ValueOrArray<T> = T | T[];
export type Or<T1, T2> = T1 extends true ? true : T2 extends true ? true : false;
export type IfThenElse<If, Then, Else> = If extends true ? Then : Else;
export type PromiseOf<T> = T extends Promise<infer U> ? U : T;
export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
};
export type NonArray<T> = T extends any[] ? never : T;
export declare function getTableColumns<T extends Table>(table: T): T['_']['columns'];
export declare function getViewSelectedFields<T extends View>(view: T): T['_']['selectedFields'];
export type ColumnsWithTable<TTableName extends string, TForeignTableName extends string, TColumns extends AnyColumn<{
    tableName: TTableName;
}>[]> = {
    [Key in keyof TColumns]: AnyColumn<{
        tableName: TForeignTableName;
    }>;
};
export type Casing = 'snake_case' | 'camelCase';
export interface DrizzleConfig<TSchema extends Record<string, unknown> = Record<string, never>> {
    logger?: boolean | Logger;
    schema?: TSchema;
    casing?: Casing;
    cache?: Cache;
}
export type ValidateShape<T, ValidShape, TResult = T> = T extends ValidShape ? Exclude<keyof T, keyof ValidShape> extends never ? TResult : DrizzleTypeError<`Invalid key(s): ${Exclude<(keyof T) & (string | number | bigint | boolean | null | undefined), keyof ValidShape>}`> : never;
export type KnownKeysOnly<T, U> = {
    [K in keyof T]: K extends keyof U ? T[K] : never;
};
export type IsAny<T> = 0 extends (1 & T) ? true : false;
export type IfNotImported<T, Y, N> = unknown extends T ? Y : N;
export type ImportTypeError<TPackageName extends string> = `Please install \`${TPackageName}\` to allow Drizzle ORM to connect to the database`;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Keys extends any ? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>> : never;
export declare function isConfig(data: any): boolean;
export type NeonAuthToken = string | (() => string | Promise<string>);
export declare const textDecoder: TextDecoder | null;
