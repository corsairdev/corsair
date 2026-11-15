import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { z } from 'zod';
import { createCorsair, isNoPersistActive, runWithoutPersist } from '../core';
import type { CorsairKyselyDatabase } from '../db/kysely/database';
import { createCorsairDatabase } from '../db/kysely/database';
import { SqliteDatePlugin } from '../db/kysely/sqlite-date-plugin';
import { logEvent } from '../plugins/utils/events';
import { setupCorsair } from '../setup';

const notePlugin = {
	id: 'slack' as const,
	options: { authType: 'api_key' as const },
	schema: {
		version: '1',
		entities: { channels: z.object({ title: z.string() }) },
	},
};

function createTestDb() {
	const sqlite = new Database(':memory:');
	sqlite.exec(`
		CREATE TABLE corsair_integrations (
			id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
			name TEXT NOT NULL, config TEXT NOT NULL, dek TEXT NULL
		);
		CREATE TABLE corsair_accounts (
			id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
			tenant_id TEXT NOT NULL, integration_id TEXT NOT NULL,
			config TEXT NOT NULL, dek TEXT NULL
		);
		CREATE TABLE corsair_entities (
			id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
			account_id TEXT NOT NULL, entity_id TEXT NOT NULL, entity_type TEXT NOT NULL,
			version TEXT NOT NULL, data TEXT NOT NULL
		);
		CREATE TABLE corsair_events (
			id TEXT PRIMARY KEY, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
			account_id TEXT NOT NULL, event_type TEXT NOT NULL, payload TEXT NOT NULL,
			status TEXT
		);
	`);
	const db = new Kysely<CorsairKyselyDatabase>({
		dialect: new SqliteDialect({ database: sqlite }),
		plugins: [new SqliteDatePlugin()],
	});
	return {
		db,
		cleanup: () => {
			db.destroy();
			sqlite.close();
		},
	};
}

describe('no-persist scope', () => {
	let testDb: ReturnType<typeof createTestDb>;

	beforeEach(() => {
		testDb = createTestDb();
	});

	afterEach(() => {
		testDb.cleanup();
	});

	async function setup() {
		const corsair = createCorsair({
			kek: 'kek-for-tests',
			plugins: [notePlugin],
			database: testDb.db,
		});
		await setupCorsair(corsair, { silent: true });
		return corsair;
	}

	const rows = () =>
		testDb.db.selectFrom('corsair_entities').selectAll().execute();
	const events = () =>
		testDb.db.selectFrom('corsair_events').selectAll().execute();

	it('is inactive unless entered', async () => {
		expect(isNoPersistActive()).toBe(false);
		await runWithoutPersist(async () => {
			expect(isNoPersistActive()).toBe(true);
		});
		expect(isNoPersistActive()).toBe(false);
	});

	it('writes normally outside the scope', async () => {
		const corsair = await setup();
		await corsair.slack.db.channels.upsertByEntityId('c1', { title: 'a' });
		expect(await rows()).toHaveLength(1);
	});

	it('upsert returns the would-be row and writes nothing', async () => {
		const corsair = await setup();
		const row = await runWithoutPersist(() =>
			corsair.slack.db.channels.upsertByEntityId('c1', { title: 'a' }),
		);
		expect(row).toMatchObject({
			entity_id: 'c1',
			entity_type: 'channels',
			data: { title: 'a' },
		});
		expect(row.id).toEqual(expect.any(String));
		expect(await rows()).toHaveLength(0);
	});

	it('upsert still validates the document', async () => {
		const corsair = await setup();
		await expect(
			runWithoutPersist(() =>
				corsair.slack.db.channels.upsertByEntityId('c1', {
					// unknown: deliberately breaks the plugin schema
					title: 1 as unknown as string,
				}),
			),
		).rejects.toThrow();
	});

	it('does not overwrite or delete an existing row', async () => {
		const corsair = await setup();
		const saved = await corsair.slack.db.channels.upsertByEntityId('c1', {
			title: 'full',
		});
		await runWithoutPersist(async () => {
			await corsair.slack.db.channels.upsertByEntityId('c1', {
				title: 'stub',
			});
			await corsair.slack.db.channels.deleteById(saved.id);
			await corsair.slack.db.channels.deleteByEntityId('c1');
		});
		const after = await corsair.slack.db.channels.findByEntityId('c1');
		expect(after?.data).toEqual({ title: 'full' });
	});

	it('survives an await boundary and does not leak to the next call', async () => {
		const corsair = await setup();
		await runWithoutPersist(async () => {
			await new Promise((r) => setTimeout(r, 5));
			await corsair.slack.db.channels.upsertByEntityId('c1', { title: 'a' });
		});
		expect(await rows()).toHaveLength(0);
		await corsair.slack.db.channels.upsertByEntityId('c2', { title: 'b' });
		expect(await rows()).toHaveLength(1);
	});

	it('skips logEvent', async () => {
		await setup();
		const database = createCorsairDatabase(testDb.db);
		const inScope = await runWithoutPersist(() =>
			logEvent(database, 'acct', 'note.created', { a: 1 }),
		);
		expect(inScope).toBeNull();
		expect(await events()).toHaveLength(0);
		const outside = await logEvent(database, 'acct', 'note.created', { a: 1 });
		expect(outside).toEqual(expect.any(String));
		expect(await events()).toHaveLength(1);
	});
});
