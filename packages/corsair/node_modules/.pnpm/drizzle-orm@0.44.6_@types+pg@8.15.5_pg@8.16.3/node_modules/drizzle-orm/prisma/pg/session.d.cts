import type { PrismaClient } from '@prisma/client/extension';
import { entityKind } from "../../entity.cjs";
import { type Logger } from "../../logger.cjs";
import type { PgDialect, PgQueryResultHKT, PgTransaction, PgTransactionConfig, PreparedQueryConfig } from "../../pg-core/index.cjs";
import { PgPreparedQuery, PgSession } from "../../pg-core/index.cjs";
import type { Query, SQL } from "../../sql/sql.cjs";
export declare class PrismaPgPreparedQuery<T> extends PgPreparedQuery<PreparedQueryConfig & {
    execute: T;
}> {
    private readonly prisma;
    private readonly logger;
    static readonly [entityKind]: string;
    constructor(prisma: PrismaClient, query: Query, logger: Logger);
    execute(placeholderValues?: Record<string, unknown>): Promise<T>;
    all(): Promise<unknown>;
    isResponseInArrayMode(): boolean;
}
export interface PrismaPgSessionOptions {
    logger?: Logger;
}
export declare class PrismaPgSession extends PgSession {
    private readonly prisma;
    private readonly options;
    static readonly [entityKind]: string;
    private readonly logger;
    constructor(dialect: PgDialect, prisma: PrismaClient, options: PrismaPgSessionOptions);
    execute<T>(query: SQL): Promise<T>;
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query): PgPreparedQuery<T>;
    transaction<T>(_transaction: (tx: PgTransaction<PgQueryResultHKT, Record<string, never>, Record<string, never>>) => Promise<T>, _config?: PgTransactionConfig): Promise<T>;
}
export interface PrismaPgQueryResultHKT extends PgQueryResultHKT {
    type: [];
}
