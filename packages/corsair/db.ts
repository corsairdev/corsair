/**
 * Corsair Database - Database types and utilities for Corsair integrations
 *
 * This module exports all database-related types including:
 * - Table row types (CorsairAccount, CorsairEntity, etc.)
 * - Insert and update types
 * - Database connection types
 * - Database adapter interface (for SQL and NoSQL backends)
 * - Kysely database types
 *
 * @example
 * ```ts
 * import type { CorsairAccountInsert, CorsairTableName } from 'corsair/db';
 * ```
 */

export { sql } from 'kysely';
export * from './db/index';
export type { CorsairDatabaseAdapter, CorsairPermissionOps } from './db/adapter';
export type {
	CorsairDatabase,
	CorsairDatabaseInput,
	CorsairKyselyDatabase,
} from './db/kysely/database';
export { createCorsairDatabase } from './db/kysely/database';
export { KyselyDatabaseAdapter } from './db/kysely/adapter';
