import { Kysely, PostgresDialect, SqliteDialect } from 'kysely';
import type { Pool } from 'pg';
import type { CorsairDatabaseAdapter } from './adapter';
import type {
	CorsairKyselyDatabase,
	BetterSqlite3Database,
} from './kysely/database';
import { KyselyDatabaseAdapter } from './kysely/adapter';
import { SqliteDatePlugin } from './kysely/sqlite-date-plugin.js';

// Re-export Kysely-specific types for backwards compatibility
export type { CorsairKyselyDatabase, BetterSqlite3Database } from './kysely/database';

/**
 * The database handle passed throughout Corsair.
 *
 * An alias for the backend-agnostic adapter interface so that SQL and NoSQL
 * backends (Kysely, Convex, MongoDB, …) are interchangeable.
 */
export type CorsairDatabase = CorsairDatabaseAdapter;

/**
 * Accepted input types for `createCorsair({ database: ... })`.
 *
 * Supports:
 * - Pre-built adapters (ConvexDatabaseAdapter, KyselyDatabaseAdapter, etc.)
 * - SQL drivers (pg Pool, better-sqlite3) — auto-wrapped in KyselyDatabaseAdapter
 * - Raw Kysely instances — auto-wrapped in KyselyDatabaseAdapter
 */
export type CorsairDatabaseInput =
	| Pool
	| BetterSqlite3Database
	| Kysely<CorsairKyselyDatabase>
	| CorsairDatabaseAdapter;

// ---------------------------------------------------------------------------
// Detection helpers
// ---------------------------------------------------------------------------

function isAdapter(input: CorsairDatabaseInput): input is CorsairDatabaseAdapter {
	return (
		typeof input === 'object' &&
		input !== null &&
		'createEntityClient' in input &&
		typeof (input as CorsairDatabaseAdapter).createEntityClient === 'function'
	);
}

function isPgPool(input: CorsairDatabaseInput): input is Pool {
	return (
		typeof (input as Pool).query === 'function' &&
		typeof (input as Pool).connect === 'function'
	);
}

function isBetterSqlite3(
	input: CorsairDatabaseInput,
): input is BetterSqlite3Database {
	const db = input as { prepare?: unknown; exec?: unknown; close?: unknown };
	return (
		typeof db.prepare === 'function' &&
		typeof db.exec === 'function' &&
		typeof db.close === 'function' &&
		!('query' in input)
	);
}

function isKysely(
	input: CorsairDatabaseInput,
): input is Kysely<CorsairKyselyDatabase> {
	return (
		typeof (input as Kysely<CorsairKyselyDatabase>).selectFrom === 'function'
	);
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Normalises any supported database input into a `CorsairDatabaseAdapter`.
 *
 * - If the input already satisfies `CorsairDatabaseAdapter`, it is returned
 *   as-is (Convex, custom adapters, etc.).
 * - SQL drivers (pg Pool, better-sqlite3) and raw Kysely instances are
 *   automatically wrapped in a `KyselyDatabaseAdapter`.
 */
export function createCorsairDatabase(
	input: CorsairDatabaseInput,
): CorsairDatabase {
	if (isAdapter(input)) {
		return input;
	}

	if (isKysely(input)) {
		return new KyselyDatabaseAdapter(input);
	}

	if (isBetterSqlite3(input)) {
		const db = new Kysely<CorsairKyselyDatabase>({
			dialect: new SqliteDialect({ database: input }),
			plugins: [new SqliteDatePlugin()],
		});
		return new KyselyDatabaseAdapter(db);
	}

	if (isPgPool(input)) {
		const db = new Kysely<CorsairKyselyDatabase>({
			dialect: new PostgresDialect({ pool: input }),
		});
		return new KyselyDatabaseAdapter(db);
	}

	throw new Error(
		'Unsupported database input. Expected a pg Pool, better-sqlite3 Database, Kysely instance, or a CorsairDatabaseAdapter.',
	);
}
