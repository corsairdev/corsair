// @ts-expect-error - better-sqlite3 types may not be available
import Database from 'better-sqlite3';
import { z } from 'zod';
import { createCorsairDatabase } from '../db/kysely/database';
import { createPluginOrm } from '../db/orm';

const TaskSchema = z.object({
	title: z.string(),
	priority: z.number(),
	done: z.boolean(),
	due: z.coerce.date(),
});

function setup() {
	const sqlite = new Database(':memory:');
	sqlite.exec(`
		CREATE TABLE corsair_integrations (
			id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
			name TEXT NOT NULL, config TEXT NOT NULL, dek TEXT NULL
		);
		CREATE TABLE corsair_accounts (
			id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
			tenant_id TEXT NOT NULL, integration_id TEXT NOT NULL, config TEXT NOT NULL, dek TEXT NULL
		);
		CREATE TABLE corsair_entities (
			id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
			account_id TEXT NOT NULL, entity_id TEXT NOT NULL, entity_type TEXT NOT NULL,
			version TEXT NOT NULL, data TEXT NOT NULL
		);
		INSERT INTO corsair_integrations VALUES ('int-1', 0, 0, 'tasks', '{}', NULL);
		INSERT INTO corsair_accounts VALUES ('acc-1', 0, 0, 'default', 'int-1', '{}', NULL);
	`);
	// The real user path: a better-sqlite3 handle passed to Corsair.
	const database = createCorsairDatabase(sqlite);
	const orm = createPluginOrm({
		database,
		integrationName: 'tasks',
		tenantId: 'default',
		schema: { version: '1.0.0', entities: { tasks: TaskSchema } },
	});
	return { orm, cleanup: () => sqlite.close() };
}

describe('entity search on SQLite', () => {
	let ctx: ReturnType<typeof setup>;

	beforeEach(async () => {
		ctx = setup();
		await ctx.orm.tasks.upsertByEntityId('t1', {
			title: 'ship release',
			priority: 5,
			done: true,
			due: new Date('2024-01-15T00:00:00.000Z'),
		});
		await ctx.orm.tasks.upsertByEntityId('t2', {
			title: 'write docs',
			priority: 1,
			done: false,
			due: new Date('2025-03-01T00:00:00.000Z'),
		});
	});

	afterEach(() => ctx.cleanup());

	const ids = (rows: Array<{ entity_id: string }>) =>
		rows.map((r) => r.entity_id).sort();

	test('string data filter', async () => {
		const rows = await ctx.orm.tasks.search({ data: { title: 'write docs' } });
		expect(ids(rows)).toEqual(['t2']);
	});

	test('number data filter', async () => {
		const rows = await ctx.orm.tasks.search({ data: { priority: { gte: 3 } } });
		expect(ids(rows)).toEqual(['t1']);
	});

	test('boolean data filter', async () => {
		expect(ids(await ctx.orm.tasks.search({ data: { done: true } }))).toEqual([
			't1',
		]);
		expect(
			ids(await ctx.orm.tasks.search({ data: { done: { equals: false } } })),
		).toEqual(['t2']);
	});

	test('date data filter', async () => {
		const rows = await ctx.orm.tasks.search({
			data: { due: { after: new Date('2024-06-01T00:00:00.000Z') } },
		});
		expect(ids(rows)).toEqual(['t2']);
	});
});

describe('corsair.<plugin>.db search with a better-sqlite3 database', () => {
	test('boolean and number filters on synced Slack channels', async () => {
		const { slack } = await import('@corsair-dev/slack');
		const { createCorsair } = await import('../core');
		const sqlite = new Database(':memory:');
		sqlite.exec(`
			CREATE TABLE corsair_integrations (
				id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
				name TEXT NOT NULL, config TEXT NOT NULL, dek TEXT NULL
			);
			CREATE TABLE corsair_accounts (
				id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
				tenant_id TEXT NOT NULL, integration_id TEXT NOT NULL, config TEXT NOT NULL, dek TEXT NULL
			);
			CREATE TABLE corsair_entities (
				id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
				account_id TEXT NOT NULL, entity_id TEXT NOT NULL, entity_type TEXT NOT NULL,
				version TEXT NOT NULL, data TEXT NOT NULL
			);
			INSERT INTO corsair_integrations VALUES ('int-1', 0, 0, 'slack', '{}', NULL);
			INSERT INTO corsair_accounts VALUES ('acc-1', 0, 0, 'default', 'int-1', '{}', NULL);
		`);
		try {
			const corsair = createCorsair({
				plugins: [slack({ authType: 'api_key', key: 'fake-key' })],
				database: sqlite,
				multiTenancy: false,
			});
			const channels = corsair.slack.db.channels;
			if (!channels) throw new Error('slack channels entity client missing');
			await channels.upsertByEntityId('C1', {
				id: 'C1',
				name: 'general',
				is_private: false,
				num_members: 40,
			});
			await channels.upsertByEntityId('C2', {
				id: 'C2',
				name: 'secret',
				is_private: true,
				num_members: 3,
			});

			const open = await channels.search({ data: { is_private: false } });
			expect(open.map((c) => c.entity_id)).toEqual(['C1']);
			const big = await channels.search({ data: { num_members: { gte: 10 } } });
			expect(big.map((c) => c.entity_id)).toEqual(['C1']);
		} finally {
			sqlite.close();
		}
	});
});
