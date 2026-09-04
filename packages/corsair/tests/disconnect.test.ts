import type { CorsairInternalConfig } from '../core';
import { disconnectConnection } from '../core/management/operations';

const KEK = 'test-kek-with-at-least-32-characters!!';

function createTestDatabase() {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const Database = require('better-sqlite3') as typeof import('better-sqlite3');
	const { Kysely, SqliteDialect } =
		require('kysely') as typeof import('kysely');
	const { SqliteDatePlugin } =
		require('../db/kysely/sqlite-date-plugin.js') as {
			SqliteDatePlugin: new () => import('kysely').KyselyPlugin;
		};

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
			account_id TEXT NOT NULL, event_type TEXT NOT NULL, payload TEXT NOT NULL, status TEXT
		);
	`);

	const db = new Kysely({
		dialect: new SqliteDialect({ database: sqlite }),
		plugins: [new SqliteDatePlugin()],
	});

	return {
		db,
		destroy: async () => {
			await db.destroy();
			sqlite.close();
		},
	};
}

// Seeds a connection (integration + account) plus one dependent row in each
// child table, all linked to the returned accountId.
async function seedConnection(
	db: ReturnType<typeof createTestDatabase>['db'],
	tenantId: string,
	accountId: string,
) {
	const now = new Date();
	const integrationId = `slack-int-${tenantId}`;
	await db
		.insertInto('corsair_integrations')
		.values({
			id: integrationId,
			created_at: now,
			updated_at: now,
			name: 'slack',
			config: '{}',
			dek: 'x',
		})
		.onConflict((oc) => oc.column('id').doNothing())
		.execute();
	await db
		.insertInto('corsair_accounts')
		.values({
			id: accountId,
			created_at: now,
			updated_at: now,
			tenant_id: tenantId,
			integration_id: integrationId,
			config: '{}',
			dek: 'x',
		})
		.execute();
	await db
		.insertInto('corsair_entities')
		.values({
			id: `ent-${accountId}`,
			created_at: now,
			updated_at: now,
			account_id: accountId,
			entity_id: 'e1',
			entity_type: 'channel',
			version: '1',
			data: '{}',
		})
		.execute();
	await db
		.insertInto('corsair_events')
		.values({
			id: `evt-${accountId}`,
			created_at: now,
			updated_at: now,
			account_id: accountId,
			event_type: 'message',
			payload: '{}',
			status: null,
		})
		.execute();
	return integrationId;
}

function internalFor(
	db: ReturnType<typeof createTestDatabase>['db'],
): CorsairInternalConfig {
	return {
		plugins: [{ id: 'slack' }],
		database: { db },
		kek: KEK,
	} as unknown as CorsairInternalConfig;
}

const countFor = (
	db: ReturnType<typeof createTestDatabase>['db'],
	table: 'corsair_accounts' | 'corsair_entities' | 'corsair_events',
	accountId: string,
) =>
	db
		.selectFrom(table)
		.select((eb) => eb.fn.countAll<number>().as('n'))
		.where('account_id', '=', accountId)
		.executeTakeFirstOrThrow()
		.then((r) => Number(r.n));

describe('manage.disconnect', () => {
	it('removes the account and cascades its entities and events', async () => {
		const { db, destroy } = createTestDatabase();
		try {
			await seedConnection(db, 't1', 'acc1');

			const result = await disconnectConnection(internalFor(db), {
				plugin: 'slack',
				tenantId: 't1',
			});

			expect(result).toEqual({ ok: true, disconnected: true });
			expect(
				await db
					.selectFrom('corsair_accounts')
					.selectAll()
					.where('id', '=', 'acc1')
					.executeTakeFirst(),
			).toBeUndefined();
			expect(await countFor(db, 'corsair_entities', 'acc1')).toBe(0);
			expect(await countFor(db, 'corsair_events', 'acc1')).toBe(0);
		} finally {
			await destroy();
		}
	});

	it('is idempotent — a missing connection is not an error', async () => {
		const { db, destroy } = createTestDatabase();
		try {
			const result = await disconnectConnection(internalFor(db), {
				plugin: 'slack',
				tenantId: 'never-connected',
			});
			expect(result).toEqual({ ok: true, disconnected: false });
		} finally {
			await destroy();
		}
	});

	it('never touches another tenant’s connection', async () => {
		const { db, destroy } = createTestDatabase();
		try {
			await seedConnection(db, 't1', 'acc1');
			await seedConnection(db, 't2', 'acc2');

			await disconnectConnection(internalFor(db), {
				plugin: 'slack',
				tenantId: 't1',
			});

			expect(
				await db
					.selectFrom('corsair_accounts')
					.selectAll()
					.where('id', '=', 'acc2')
					.executeTakeFirst(),
			).toBeDefined();
			expect(await countFor(db, 'corsair_entities', 'acc2')).toBe(1);
		} finally {
			await destroy();
		}
	});

	it('rejects an unknown plugin', async () => {
		const { db, destroy } = createTestDatabase();
		try {
			await expect(
				disconnectConnection(internalFor(db), { plugin: 'nope' }),
			).rejects.toThrow();
		} finally {
			await destroy();
		}
	});
});
