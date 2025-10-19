import { entityKind } from "../entity.cjs";
import type { Logger } from "../logger.cjs";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "../relations.cjs";
import { type Query } from "../sql/sql.cjs";
import { type SQLiteSyncDialect, SQLiteTransaction } from "../sqlite-core/index.cjs";
import type { SelectedFieldsOrdered } from "../sqlite-core/query-builders/select.types.cjs";
import { type PreparedQueryConfig as PreparedQueryConfigBase, type SQLiteExecuteMethod, SQLiteSession, type SQLiteTransactionConfig } from "../sqlite-core/session.cjs";
import { SQLitePreparedQuery as PreparedQueryBase } from "../sqlite-core/session.cjs";
export interface SQLiteDOSessionOptions {
    logger?: Logger;
}
type PreparedQueryConfig = Omit<PreparedQueryConfigBase, 'statement' | 'run'>;
export declare class SQLiteDOSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteSession<'sync', SqlStorageCursor<Record<string, SqlStorageValue>>, TFullSchema, TSchema> {
    private client;
    private schema;
    static readonly [entityKind]: string;
    private logger;
    constructor(client: DurableObjectStorage, dialect: SQLiteSyncDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: SQLiteDOSessionOptions);
    prepareQuery<T extends Omit<PreparedQueryConfig, 'run'>>(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown): SQLiteDOPreparedQuery<T>;
    transaction<T>(transaction: (tx: SQLiteTransaction<'sync', SqlStorageCursor<Record<string, SqlStorageValue>>, TFullSchema, TSchema>) => T, _config?: SQLiteTransactionConfig): T;
}
export declare class SQLiteDOTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteTransaction<'sync', SqlStorageCursor<Record<string, SqlStorageValue>>, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(transaction: (tx: SQLiteDOTransaction<TFullSchema, TSchema>) => T): T;
}
export declare class SQLiteDOPreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig> extends PreparedQueryBase<{
    type: 'sync';
    run: void;
    all: T['all'];
    get: T['get'];
    values: T['values'];
    execute: T['execute'];
}> {
    private client;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    static readonly [entityKind]: string;
    constructor(client: DurableObjectStorage, query: Query, logger: Logger, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => unknown) | undefined);
    run(placeholderValues?: Record<string, unknown>): void;
    all(placeholderValues?: Record<string, unknown>): T['all'];
    get(placeholderValues?: Record<string, unknown>): T['get'];
    values(placeholderValues?: Record<string, unknown>): T['values'];
}
export {};
