import type { SqliteDialectConfig } from 'kysely';
import { Kysely, PostgresDialect, SqliteDialect } from 'kysely';
import type { Pool } from 'pg';
import type {
	CorsairAccount,
	CorsairEntity,
	CorsairEvent,
	CorsairIntegration,
	CorsairPermission,
} from '../index';
import type { CorsairDatabaseAdapter } from '../adapter';
import { KyselyDatabaseAdapter } from './adapter';
import { SqliteDatePlugin } from './sqlite-date-plugin.js';

export type CorsairKyselyDatabase = {
	corsair_integrations: CorsairIntegration;
	corsair_accounts: CorsairAccount;
	corsair_entities: CorsairEntity;
	corsair_events: CorsairEvent;
	corsair_permissions: CorsairPermission;
};

/**
 * The database handle passed throughout Corsair.
 *
 * Previously `{ db: Kysely<...> }` — now an alias for the backend-agnostic
 * adapter interface so that SQL and NoSQL backends are interchangeable.
 */
export type CorsairDatabase = CorsairDatabaseAdapter;

/**
 * better-sqlite3 Database instance.
 * Uses Kysely's expected SqliteDatabase type from SqliteDialectConfig.
 */
export type BetterSqlite3Database = NonNullable<
	SqliteDialectConfig['database']
>;

/**
 * Accepted input types for `createCorsair({ database: ... })`.
 * Includes SQL drivers (pg Pool, better-sqlite3, raw Kysely) and
 * pre-built adapters for NoSQL backends.
 */
export type CorsairDatabaseInput =
	| Pool
	| BetterSqlite3Database
	| Kysely<CorsairKyselyDatabase>
	| CorsairDatabaseAdapter;

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
