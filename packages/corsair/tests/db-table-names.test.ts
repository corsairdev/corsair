// @ts-expect-error - better-sqlite3 types may not be available
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import type { CorsairDatabase } from '../db/kysely/database';
import {
	createCorsairDatabase,
	validateCorsairDbTables,
} from '../db/kysely/database';

describe('dbTables name mapping', () => {
	it('rewrites Kysely SQL to physical table names', async () => {
		const sqlite = new Database(':memory:');
		sqlite.exec(`
			CREATE TABLE events (
				id TEXT PRIMARY KEY,
				created_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				account_id TEXT NOT NULL,
				event_type TEXT NOT NULL,
				payload TEXT NOT NULL,
				status TEXT
			);
		`);

		const { db, tableNames } = createCorsairDatabase(sqlite, {
			dbTables: { corsair_events: 'events' },
		});

		expect(tableNames.corsair_events).toBe('events');

		const id = 'evt-1';
		const now = new Date('2024-01-01T00:00:00.000Z');
		await db
			.insertInto('corsair_events')
			.values({
				id,
				created_at: now,
				updated_at: now,
				account_id: 'acc-1',
				event_type: 'test.event',
				payload: { ok: true },
			})
			.execute();

		const row = sqlite
			.prepare('SELECT id, event_type FROM events WHERE id = ?')
			.get(id) as { id: string; event_type: string };

		expect(row).toEqual({ id, event_type: 'test.event' });

		const compiled = db.selectFrom('corsair_events').select('id').compile();
		expect(compiled.sql).toContain('events');
		expect(compiled.sql).not.toContain('corsair_events');

		await db.destroy();
		sqlite.close();
	});

	it('rejects duplicate physical table names', () => {
		const sqlite = new Database(':memory:');
		expect(() =>
			createCorsairDatabase(sqlite, {
				dbTables: {
					corsair_events: 'shared',
					corsair_entities: 'shared',
				},
			}),
		).toThrow(/duplicate physical table name/i);
		sqlite.close();
	});

	// The collision that matters: one override onto a table whose own name was
	// left at its default. Both then resolve to one physical table.
	it('rejects an override that collides with another default', () => {
		const sqlite = new Database(':memory:');
		expect(() =>
			createCorsairDatabase(sqlite, {
				dbTables: { corsair_events: 'corsair_integrations' },
			}),
		).toThrow(/duplicate physical table name/i);
		sqlite.close();
	});

	it('rejects an unknown dbTables key', () => {
		const sqlite = new Database(':memory:');
		expect(() =>
			createCorsairDatabase(sqlite, {
				dbTables: { corsair_event: 'events' } as never,
			}),
		).toThrow(/corsair_event/);
		sqlite.close();
	});

	// Postgres truncates an identifier at 63 bytes, so two names agreeing up to
	// there become one table with no error.
	it('rejects a name past the identifier limit', () => {
		const sqlite = new Database(':memory:');
		expect(() =>
			createCorsairDatabase(sqlite, {
				dbTables: { corsair_events: `corsair_events_${'x'.repeat(50)}` },
			}),
		).toThrow(/63 bytes/i);
		sqlite.close();
	});

	// One schema per project puts an instance's five tables in the project's
	// schema under a suffixed name, so both transforms have to survive together:
	// withSchema writes the schema, the map writes the table.
	it('composes with withSchema on Postgres', () => {
		const pool = { query: () => {}, connect: () => {} };
		const { db } = createCorsairDatabase(pool as never, {
			dbTables: { corsair_events: 'corsair_events_users' },
		});

		const compiled = db
			.withSchema('env_proj1')
			.selectFrom('corsair_events')
			.select('id')
			.compile();

		expect(compiled.sql).toContain('"env_proj1"."corsair_events_users"');
	});

	it('takes a database literal that names no tables', () => {
		const sqlite = new Database(':memory:');
		const { db } = createCorsairDatabase(sqlite);
		const database: CorsairDatabase = { db };
		expect(database.db).toBe(db);
		sqlite.close();
	});

	it('rejects case-only duplicate physical table names on SQLite', () => {
		const sqlite = new Database(':memory:');
		expect(() =>
			createCorsairDatabase(sqlite, {
				dbTables: {
					corsair_accounts: 'SharedTable',
					corsair_entities: 'sharedtable',
				},
			}),
		).toThrow(/duplicate physical table name/i);

		expect(() =>
			createCorsairDatabase(sqlite, {
				dbTables: {
					corsair_events: 'CORSAIR_INTEGRATIONS',
				},
			}),
		).toThrow(/duplicate physical table name/i);

		expect(() =>
			validateCorsairDbTables(
				{
					corsair_accounts: 'SharedTable',
					corsair_entities: 'sharedtable',
				},
				{ dialect: 'sqlite' },
			),
		).toThrow(/duplicate physical table name/i);

		const kyselySqlite = new Kysely({
			dialect: new SqliteDialect({ database: sqlite }),
		});
		expect(() =>
			createCorsairDatabase(kyselySqlite as never, {
				dbTables: {
					corsair_accounts: 'SharedTable',
					corsair_entities: 'sharedtable',
				},
			}),
		).toThrow(/duplicate physical table name/i);

		// Simulate a Kysely instance constructed from a separate module copy whose
		// SqliteAdapter class is not instanceof the imported SqliteAdapter.
		class ForeignSqliteAdapter {
			readonly supportsTransactionalDdl = false;
			readonly supportsReturning = true;
		}
		const foreignKyselySqlite = {
			selectFrom: () => {},
			withPlugin: () => foreignKyselySqlite,
			getExecutor: () => ({ adapter: new ForeignSqliteAdapter() }),
		};
		expect(() =>
			createCorsairDatabase(foreignKyselySqlite as never, {
				dbTables: {
					corsair_accounts: 'SharedTable',
					corsair_entities: 'sharedtable',
				},
			}),
		).toThrow(/duplicate physical table name/i);

		sqlite.close();
	});

	it('preserves distinct non-ASCII table names on SQLite', () => {
		const sqlite = new Database(':memory:');
		expect(() =>
			createCorsairDatabase(sqlite, {
				dbTables: {
					corsair_accounts: 'Ä',
					corsair_entities: 'ä',
				},
			}),
		).not.toThrow();

		expect(() =>
			validateCorsairDbTables(
				{
					corsair_accounts: 'Ä',
					corsair_entities: 'ä',
				},
				{ dialect: 'sqlite' },
			),
		).not.toThrow();
		sqlite.close();
	});

	it('allows case-only distinct physical table names on Postgres', () => {
		const pool = { query: () => {}, connect: () => {} };
		expect(() =>
			createCorsairDatabase(pool as never, {
				dbTables: {
					corsair_accounts: 'SharedTable',
					corsair_entities: 'sharedtable',
				},
			}),
		).not.toThrow();

		expect(() =>
			validateCorsairDbTables({
				corsair_accounts: 'SharedTable',
				corsair_entities: 'sharedtable',
			}),
		).not.toThrow();
	});
});
