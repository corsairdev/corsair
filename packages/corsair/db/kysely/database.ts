import type { SqliteDialectConfig } from 'kysely';
import { Kysely, PostgresDialect, SqliteDialect } from 'kysely';
import type { Pool } from 'pg';
import type {
	CorsairAccount,
	CorsairEntity,
	CorsairEvent,
	CorsairIntegration,
} from '../index';

export type CorsairKyselyDatabase = {
	corsair_integrations: CorsairIntegration;
	corsair_accounts: CorsairAccount;
	corsair_entities: CorsairEntity;
	corsair_events: CorsairEvent;
};

export type CorsairDatabase = {
	db: Kysely<CorsairKyselyDatabase>;
};

/**
 * better-sqlite3 Database instance.
 * Uses Kysely's expected SqliteDatabase type from SqliteDialectConfig.
 */
export type BetterSqlite3Database = NonNullable<
	SqliteDialectConfig['database']
>;

export type CorsairDatabaseInput =
	| Pool
	| BetterSqlite3Database
	| Kysely<CorsairKyselyDatabase>;

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
	if (isKysely(input)) {
		return { db: input };
	}

	if (isBetterSqlite3(input)) {
		const db = new Kysely<CorsairKyselyDatabase>({
			dialect: new SqliteDialect({ database: input }),
		});
		return { db };
	}

	if (isPgPool(input)) {
		const db = new Kysely<CorsairKyselyDatabase>({
			dialect: new PostgresDialect({ pool: input }),
		});
		return { db };
	}

	throw new Error(
		'Unsupported database input. Expected a pg Pool, better-sqlite3 Database, or a Kysely instance.',
	);
}
