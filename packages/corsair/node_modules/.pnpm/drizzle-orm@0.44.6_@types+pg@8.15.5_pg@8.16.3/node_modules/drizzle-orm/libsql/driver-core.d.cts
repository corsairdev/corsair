import type { ResultSet } from '@libsql/client';
import type { BatchItem, BatchResponse } from "../batch.cjs";
import { entityKind } from "../entity.cjs";
import { BaseSQLiteDatabase } from "../sqlite-core/db.cjs";
export declare class LibSQLDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends BaseSQLiteDatabase<'async', ResultSet, TSchema> {
    static readonly [entityKind]: string;
    batch<U extends BatchItem<'sqlite'>, T extends Readonly<[U, ...U[]]>>(batch: T): Promise<BatchResponse<T>>;
}
