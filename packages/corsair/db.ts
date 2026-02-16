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
	CorsairDatabase,
	CorsairDatabaseInput,
	CorsairKyselyDatabase,
} from './db/kysely/database';
