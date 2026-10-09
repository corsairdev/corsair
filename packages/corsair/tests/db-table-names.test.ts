// @ts-expect-error - better-sqlite3 types may not be available
import Database from 'better-sqlite3';
import { createCorsairDatabase } from '../db/kysely/database';

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
});
