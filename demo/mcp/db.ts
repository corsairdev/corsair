import Database from 'better-sqlite3';

const sqlite = new Database(process.env.DATABASE_PATH ?? './corsair.db');

sqlite.exec(`
	CREATE TABLE IF NOT EXISTS corsair_integrations (
		id TEXT PRIMARY KEY,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL,
		name TEXT NOT NULL,
		config TEXT NOT NULL,
		dek TEXT NULL
	);

	CREATE TABLE IF NOT EXISTS corsair_accounts (
		id TEXT PRIMARY KEY,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL,
		tenant_id TEXT NOT NULL,
		integration_id TEXT NOT NULL,
		config TEXT NOT NULL,
		dek TEXT NULL
	);

	CREATE TABLE IF NOT EXISTS corsair_entities (
		id TEXT PRIMARY KEY,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL,
		account_id TEXT NOT NULL,
		entity_id TEXT NOT NULL,
		entity_type TEXT NOT NULL,
		version TEXT NOT NULL,
		data TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS corsair_events (
		id TEXT PRIMARY KEY,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL,
		account_id TEXT NOT NULL,
		event_type TEXT NOT NULL,
		payload TEXT NOT NULL,
		status TEXT
	);

	CREATE TABLE IF NOT EXISTS corsair_permissions (
		id TEXT PRIMARY KEY,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL,
		account_id TEXT NOT NULL,
		endpoint TEXT NOT NULL,
		status TEXT NOT NULL
	);
`);

export default sqlite;
