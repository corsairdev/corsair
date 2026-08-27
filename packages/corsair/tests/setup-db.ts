// @ts-expect-error - better-sqlite3 types may not be available
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import type {
	CorsairDatabase,
	CorsairKyselyDatabase,
} from '../db/kysely/database';
import { SqliteDatePlugin } from '../db/kysely/sqlite-date-plugin.js';

export function createTestDatabase(): {
	db: Kysely<CorsairKyselyDatabase>;
	database: CorsairDatabase;
	cleanup: () => void;
} {
	const sqlite = new Database(':memory:');

	sqlite.exec(`

		CREATE TABLE IF NOT EXISTS corsair_integrations (
			id TEXT PRIMARY KEY,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			name TEXT NOT NULL,
			config TEXT NOT NULL,
			dek TEXT NULL
		);

		CREATE TABLE IF NOT EXISTS corsair_accounts (
			id TEXT PRIMARY KEY,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			tenant_id TEXT NOT NULL,
			integration_id TEXT NOT NULL,
			config TEXT NOT NULL,
			dek TEXT NULL
		);

		CREATE TABLE IF NOT EXISTS corsair_entities (
			id TEXT PRIMARY KEY,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			account_id TEXT NOT NULL,
			entity_id TEXT NOT NULL,
			entity_type TEXT NOT NULL,
			version TEXT NOT NULL,
			data TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS corsair_events (
			id TEXT PRIMARY KEY,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			account_id TEXT NOT NULL,
			event_type TEXT NOT NULL,
			payload TEXT NOT NULL,
			status TEXT
		);

		CREATE TABLE IF NOT EXISTS corsair_usage_counters (
			key TEXT PRIMARY KEY,
			count INTEGER NOT NULL DEFAULT 1,
			expires_at TEXT NOT NULL
		);
		CREATE INDEX IF NOT EXISTS corsair_usage_counters_expires_at
			ON corsair_usage_counters (expires_at);

		CREATE TABLE IF NOT EXISTS corsair_permissions (
			id TEXT PRIMARY KEY,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			token TEXT NOT NULL,
			plugin TEXT NOT NULL,
			endpoint TEXT NOT NULL,
			args TEXT NOT NULL,
			tenant_id TEXT NOT NULL,
			status TEXT NOT NULL,
			expires_at TEXT NOT NULL
		);
	`);

	const db = new Kysely<CorsairKyselyDatabase>({
		dialect: new SqliteDialect({ database: sqlite }),
		plugins: [new SqliteDatePlugin()],
	});

	return {
		db,
		database: { db },
		cleanup: () => {
			db.destroy();
			sqlite.close();
		},
	};
}
