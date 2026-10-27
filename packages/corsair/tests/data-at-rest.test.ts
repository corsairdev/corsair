import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { z } from 'zod';
import { CORSAIR_INTERNAL, createCorsair } from '../core';
import { encryptDEK, generateDEK } from '../core/auth/encryption';
import {
	loadAccountDek,
	openJson,
	SEAL_KEY,
	sealJson,
} from '../db/data-at-rest';
import type { CorsairKyselyDatabase } from '../db/kysely/database';
import { createCorsairDatabase } from '../db/kysely/database';
import { SqliteDatePlugin } from '../db/kysely/sqlite-date-plugin';
import { createPluginOrm } from '../db/orm';
import { logEvent, logEventFromContext } from '../plugins/utils/events';
import { setupCorsair } from '../setup';

const KEK = 'kek-for-tests';

const noteSchema = {
	version: '1',
	entities: {
		channels: z.object({ title: z.string() }),
	},
};

const notePlugin = {
	id: 'slack' as const,
	options: { authType: 'api_key' as const },
	schema: noteSchema,
};

function encryptFlag(corsair: object): boolean | undefined {
	// unknown: CORSAIR_INTERNAL is a symbol the public client type hides.
	// A public getter would widen the API, so the test reads it through a cast.
	const internal = (
		corsair as unknown as Record<symbol, { encryptDataAtRest?: boolean }>
	)[CORSAIR_INTERNAL];
	return internal.encryptDataAtRest;
}

// unknown: sqlite returns JSON columns as text; postgres returns an object.
// The cell is a seal envelope or a plugin document, so it has no narrower type here.
function storedJson(value: unknown): Record<string, unknown> {
	const parsed: unknown =
		typeof value === 'string' ? (JSON.parse(value) as unknown) : value;
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('stored JSON was not an object');
	}
	return parsed as Record<string, unknown>;
}

function createTestDb() {
	const sqlite = new Database(':memory:');
	sqlite.exec(`
		CREATE TABLE corsair_integrations (
			id TEXT PRIMARY KEY,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			name TEXT NOT NULL,
			config TEXT NOT NULL,
			dek TEXT NULL
		);
		CREATE TABLE corsair_accounts (
			id TEXT PRIMARY KEY,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			tenant_id TEXT NOT NULL,
			integration_id TEXT NOT NULL,
			config TEXT NOT NULL,
			dek TEXT NULL
		);
		CREATE TABLE corsair_entities (
			id TEXT PRIMARY KEY,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			account_id TEXT NOT NULL,
			entity_id TEXT NOT NULL,
			entity_type TEXT NOT NULL,
			version TEXT NOT NULL,
			data TEXT NOT NULL
		);
		CREATE TABLE corsair_events (
			id TEXT PRIMARY KEY,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			account_id TEXT NOT NULL,
			event_type TEXT NOT NULL,
			payload TEXT NOT NULL,
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

function countAccountReads(db: Kysely<CorsairKyselyDatabase>): () => number {
	let reads = 0;
	const original = db.selectFrom.bind(db);
	db.selectFrom = ((
		table: Parameters<Kysely<CorsairKyselyDatabase>['selectFrom']>[0],
	) => {
		if (table === 'corsair_accounts') reads += 1;
		return original(table);
	}) as Kysely<CorsairKyselyDatabase>['selectFrom'];
	return () => reads;
}

describe('encryptDataAtRest', () => {
	it('defaults to off', () => {
		const corsair = createCorsair({ plugins: [] });
		expect(encryptFlag(corsair)).toBe(false);
	});

	it('stores the flag when set', () => {
		const corsair = createCorsair({
			plugins: [],
			encryptDataAtRest: true,
			kek: KEK,
		});
		expect(encryptFlag(corsair)).toBe(true);
	});
});

describe('sealJson', () => {
	it('round-trips and does not leave the plaintext in the stored value', () => {
		const dek = generateDEK();
		const stored = sealJson({ subject: 'hello from sarah' }, dek);
		expect(JSON.stringify(stored)).not.toContain('hello from sarah');
		expect(openJson(stored, dek)).toEqual({ subject: 'hello from sarah' });
	});

	it('returns an unsealed value unchanged', () => {
		const dek = generateDEK();
		expect(openJson({ subject: 'already plain' }, dek)).toEqual({
			subject: 'already plain',
		});
	});
});

describe('loadAccountDek', () => {
	it('unwraps the account DEK with the KEK', async () => {
		const dek = generateDEK();
		const wrapped = await encryptDEK(dek, KEK);
		const db = {
			selectFrom: () => ({
				select: () => ({
					where: () => ({
						executeTakeFirst: async () => ({ dek: wrapped }),
					}),
				}),
			}),
		};
		await expect(
			loadAccountDek(
				// unknown: the stub implements only the query loadAccountDek runs.
				// It is not a Kysely instance, and a partial type still needs a cast.
				db as unknown as Kysely<CorsairKyselyDatabase>,
				'acct_1',
				KEK,
			),
		).resolves.toBe(dek);
	});
});

describe('encryptDataAtRest database', () => {
	let testDb: ReturnType<typeof createTestDb>;

	beforeEach(() => {
		testDb = createTestDb();
	});

	afterEach(() => {
		testDb.cleanup();
	});

	it('seals entity and event writes, reads them back, and rejects JSON search', async () => {
		const corsair = createCorsair({
			kek: KEK,
			plugins: [notePlugin],
			database: testDb.db,
			encryptDataAtRest: true,
		});
		await setupCorsair(corsair, { silent: true });

		const saved = await corsair.slack.db.channels.upsertByEntityId('c1', {
			title: 'secret title',
		});
		expect(saved.data).toEqual({ title: 'secret title' });

		const entity = await testDb.db
			.selectFrom('corsair_entities')
			.selectAll()
			.executeTakeFirstOrThrow();
		const storedEntity = storedJson(entity.data);
		expect(storedEntity).toEqual({ [SEAL_KEY]: expect.any(String) });
		expect(JSON.stringify(storedEntity)).not.toContain('secret title');

		const read = await corsair.slack.db.channels.findByEntityId('c1');
		expect(read?.data).toEqual({ title: 'secret title' });

		await expect(
			corsair.slack.db.channels.search({ data: { title: 'secret title' } }),
		).rejects.toThrow(
			'Entity JSON field search cannot run while encryptDataAtRest is enabled',
		);

		const account = await testDb.db
			.selectFrom('corsair_accounts')
			.selectAll()
			.executeTakeFirstOrThrow();
		const eventId = await logEvent(
			createCorsairDatabase(testDb.db),
			account.id,
			'note.created',
			{ body: 'secret body' },
			'pending',
			KEK,
		);
		expect(eventId).toEqual(expect.any(String));

		const event = await testDb.db
			.selectFrom('corsair_events')
			.selectAll()
			.executeTakeFirstOrThrow();
		const storedEvent = storedJson(event.payload);
		expect(storedEvent).toEqual({ [SEAL_KEY]: expect.any(String) });
		expect(JSON.stringify(storedEvent)).not.toContain('secret body');

		const orm = createPluginOrm({
			database: createCorsairDatabase(testDb.db),
			integrationName: 'slack',
			schema: noteSchema,
			tenantId: 'default',
			encryptDataAtRest: true,
			kek: KEK,
		});
		const viaOrm = await orm.channels.findByEntityId('c1');
		expect(viaOrm?.data).toEqual({ title: 'secret title' });

		await corsair.slack.keys.issue_new_dek();

		const afterRotation = await corsair.slack.db.channels.findByEntityId('c1');
		expect(afterRotation?.data).toEqual({ title: 'secret title' });

		const rotatedEvent = await testDb.db
			.selectFrom('corsair_events')
			.selectAll()
			.executeTakeFirstOrThrow();
		const rotatedPayload = storedJson(rotatedEvent.payload);
		expect(JSON.stringify(rotatedPayload)).not.toContain('secret body');
		expect(
			openJson(rotatedPayload, await corsair.slack.keys.get_dek()),
		).toEqual({ body: 'secret body' });

		const fresh = createCorsair({
			kek: KEK,
			plugins: [notePlugin],
			database: testDb.db,
			encryptDataAtRest: true,
		});
		const freshRead = await fresh.slack.db.channels.findByEntityId('c1');
		expect(freshRead?.data).toEqual({ title: 'secret title' });
	});

	it('rejects an event write when the flag is on and kek is empty', async () => {
		await expect(
			logEvent(
				undefined,
				'acct',
				'note.created',
				{ body: 'secret body' },
				'pending',
				'',
			),
		).rejects.toThrow('encryptDataAtRest requires kek');
		await expect(
			logEventFromContext(
				{
					$getAccountId: async () => 'acct',
					encryptDataAtRest: true,
					kek: '',
				},
				'note.created',
				{ body: 'secret body' },
			),
		).rejects.toThrow('encryptDataAtRest requires kek');
	});

	it('rejects an entity write when the flag is on and kek is missing', async () => {
		const ready = createCorsair({
			kek: KEK,
			plugins: [notePlugin],
			database: testDb.db,
			encryptDataAtRest: true,
		});
		await setupCorsair(ready, { silent: true });

		const missingKey = createCorsair({
			kek: '',
			plugins: [notePlugin],
			database: testDb.db,
			encryptDataAtRest: true,
		});
		await expect(
			missingKey.slack.db.channels.upsertByEntityId('c1', { title: 'nope' }),
		).rejects.toThrow('encryptDataAtRest requires kek');

		const rows = await testDb.db
			.selectFrom('corsair_entities')
			.selectAll()
			.execute();
		expect(rows).toHaveLength(0);
	});

	it('retries a key load after the account receives a DEK', async () => {
		const corsair = createCorsair({
			kek: KEK,
			plugins: [notePlugin],
			database: testDb.db,
			encryptDataAtRest: true,
		});
		await setupCorsair(corsair, { silent: true });
		await testDb.db
			.updateTable('corsair_accounts')
			.set({ dek: null })
			.execute();

		await expect(
			corsair.slack.db.channels.upsertByEntityId('c1', { title: 'later' }),
		).rejects.toThrow('No DEK found');

		await corsair.slack.keys.issue_new_dek();

		const saved = await corsair.slack.db.channels.upsertByEntityId('c1', {
			title: 'later',
		});
		expect(saved.data).toEqual({ title: 'later' });
	});

	it('loads the account key once per multi-row read', async () => {
		const corsair = createCorsair({
			kek: KEK,
			plugins: [notePlugin],
			database: testDb.db,
			encryptDataAtRest: true,
		});
		await setupCorsair(corsair, { silent: true });
		await corsair.slack.db.channels.upsertByEntityId('c1', { title: 'one' });
		await corsair.slack.db.channels.upsertByEntityId('c2', { title: 'two' });
		await corsair.slack.db.channels.upsertByEntityId('c3', { title: 'three' });

		const reads = countAccountReads(testDb.db);
		const listed = await corsair.slack.db.channels.list();
		expect(listed.map((row) => row.data.title).sort()).toEqual([
			'one',
			'three',
			'two',
		]);
		expect(reads()).toBe(1);

		const many = await corsair.slack.db.channels.findManyByEntityIds([
			'c1',
			'c2',
			'c3',
		]);
		expect(many).toHaveLength(3);
		expect(reads()).toBe(2);

		const searched = await corsair.slack.db.channels.search({ limit: 10 });
		expect(searched).toHaveLength(3);
		expect(reads()).toBe(3);
	});
});
