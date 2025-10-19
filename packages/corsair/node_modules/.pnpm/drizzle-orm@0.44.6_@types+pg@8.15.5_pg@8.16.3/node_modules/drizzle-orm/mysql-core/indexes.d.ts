import { entityKind } from "../entity.js";
import type { SQL } from "../sql/sql.js";
import type { AnyMySqlColumn, MySqlColumn } from "./columns/index.js";
import type { MySqlTable } from "./table.js";
interface IndexConfig {
    name: string;
    columns: IndexColumn[];
    /**
     * If true, the index will be created as `create unique index` instead of `create index`.
     */
    unique?: boolean;
    /**
     * If set, the index will be created as `create index ... using { 'btree' | 'hash' }`.
     */
    using?: 'btree' | 'hash';
    /**
     * If set, the index will be created as `create index ... algorythm { 'default' | 'inplace' | 'copy' }`.
     */
    algorythm?: 'default' | 'inplace' | 'copy';
    /**
     * If set, adds locks to the index creation.
     */
    lock?: 'default' | 'none' | 'shared' | 'exclusive';
}
export type IndexColumn = MySqlColumn | SQL;
export declare class IndexBuilderOn {
    private name;
    private unique;
    static readonly [entityKind]: string;
    constructor(name: string, unique: boolean);
    on(...columns: [IndexColumn, ...IndexColumn[]]): IndexBuilder;
}
export interface AnyIndexBuilder {
    build(table: MySqlTable): Index;
}
export interface IndexBuilder extends AnyIndexBuilder {
}
export declare class IndexBuilder implements AnyIndexBuilder {
    static readonly [entityKind]: string;
    constructor(name: string, columns: IndexColumn[], unique: boolean);
    using(using: IndexConfig['using']): this;
    algorythm(algorythm: IndexConfig['algorythm']): this;
    lock(lock: IndexConfig['lock']): this;
}
export declare class Index {
    static readonly [entityKind]: string;
    readonly config: IndexConfig & {
        table: MySqlTable;
    };
    constructor(config: IndexConfig, table: MySqlTable);
}
export type GetColumnsTableName<TColumns> = TColumns extends AnyMySqlColumn<{
    tableName: infer TTableName extends string;
}> | AnyMySqlColumn<{
    tableName: infer TTableName extends string;
}>[] ? TTableName : never;
export declare function index(name: string): IndexBuilderOn;
export declare function uniqueIndex(name: string): IndexBuilderOn;
export {};
