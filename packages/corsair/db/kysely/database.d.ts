import type { SqliteDialectConfig } from 'kysely';
import { Kysely } from 'kysely';
import type { Pool } from 'pg';
import type { CorsairAccount, CorsairEntity, CorsairEvent, CorsairIntegration, CorsairPermission } from '../index';
export type CorsairKyselyDatabase = {
    corsair_integrations: CorsairIntegration;
    corsair_accounts: CorsairAccount;
    corsair_entities: CorsairEntity;
    corsair_events: CorsairEvent;
    corsair_permissions: CorsairPermission;
};
export type CorsairDatabase = {
    db: Kysely<CorsairKyselyDatabase>;
};
/**
 * better-sqlite3 Database instance.
 * Uses Kysely's expected SqliteDatabase type from SqliteDialectConfig.
 */
export type BetterSqlite3Database = NonNullable<SqliteDialectConfig['database']>;
export type CorsairDatabaseInput = Pool | BetterSqlite3Database | Kysely<CorsairKyselyDatabase>;
export declare function createCorsairDatabase(input: CorsairDatabaseInput): CorsairDatabase;
//# sourceMappingURL=database.d.ts.map