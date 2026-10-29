/**
 * Corsair Database - Database types and utilities for Corsair integrations
 *
 * This module exports all database-related types including:
 * - Table row types (CorsairAccount, CorsairEntity, etc.)
 * - Insert and update types
 * - Database connection types
 * - Kysely database types
 *
 * @example
 * ```ts
 * import type { CorsairAccountInsert, CorsairTableName } from 'corsair/db';
 * ```
 */

export { sql } from 'kysely';
export * from './db/index';
export type {
	CorsairCoreTableName,
	CorsairDatabase,
	CorsairDatabaseInput,
	CorsairDbTables,
	CorsairKyselyDatabase,
	CorsairResolvedTableNames,
	CreateCorsairDatabaseOptions,
} from './db/kysely/database';
export {
	CORSAIR_CORE_TABLE_NAMES,
	createCorsairDatabase,
	resolveCorsairDbTables,
} from './db/kysely/database';
