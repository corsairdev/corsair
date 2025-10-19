import type { Database, Statement as BunStatement } from 'bun:sqlite';
import { entityKind } from "../entity.js";
import type { Logger } from "../logger.js";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.js";
import { type Query } from "../sql/sql.js";
import type { SQLiteSyncDialect } from "../sqlite-core/dialect.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import type { SelectedFieldsOrdered } from "../sqlite-core/query-builders/select.types.js";
import type { PreparedQueryConfig as PreparedQueryConfigBase, SQLiteExecuteMethod, SQLiteTransactionConfig } from "../sqlite-core/session.js";
import { SQLitePreparedQuery as PreparedQueryBase, SQLiteSession } from "../sqlite-core/session.js";
export interface SQLiteBunSessionOptions {
    logger?: Logger;
}
type PreparedQueryConfig = Omit<PreparedQueryConfigBase, 'statement' | 'run'>;
type Statement = BunStatement<any>;
export declare class SQLiteBunSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteSession<'sync', void, TFullSchema, TSchema> {
    private client;
    private schema;
    static readonly [entityKind]: string;
    private logger;
    constructor(client: Database, dialect: SQLiteSyncDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: SQLiteBunSessionOptions);
    exec(query: string): void;
    prepareQuery<T extends Omit<PreparedQueryConfig, 'run'>>(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown): PreparedQuery<T>;
    transaction<T>(transaction: (tx: SQLiteBunTransaction<TFullSchema, TSchema>) => T, config?: SQLiteTransactionConfig): T;
}
export declare class SQLiteBunTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteTransaction<'sync', void, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(transaction: (tx: SQLiteBunTransaction<TFullSchema, TSchema>) => T): T;
}
export declare class PreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig> extends PreparedQueryBase<{
    type: 'sync';
    run: void;
    all: T['all'];
    get: T['get'];
    values: T['values'];
    execute: T['execute'];
}> {
    private stmt;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    static readonly [entityKind]: string;
    constructor(stmt: Statement, query: Query, logger: Logger, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => unknown) | undefined);
    run(placeholderValues?: Record<string, unknown>): import("bun:sqlite").Changes;
    all(placeholderValues?: Record<string, unknown>): T['all'];
    get(placeholderValues?: Record<string, unknown>): T['get'];
    values(placeholderValues?: Record<string, unknown>): T['values'];
}
export {};
