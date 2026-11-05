// @ts-expect-error - better-sqlite3 types may not be available
import Database from 'better-sqlite3';
import {
	DummyDriver,
	Kysely,
	PostgresAdapter,
	PostgresIntrospector,
	PostgresQueryCompiler,
} from 'kysely';
import { z } from 'zod';
import type { CorsairKyselyDatabase } from '../db/kysely/database';
import { createCorsairDatabase } from '../db/kysely/database';
import { createKyselyEntityClient } from '../db/kysely/orm';
import { createPluginOrm } from '../db/orm';

const ChannelSchema = z.object({ name: z.string() });

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
		INSERT INTO corsair_integrations VALUES ('int-1', 0, 0, 'chat', '{}', NULL);
		INSERT INTO corsair_accounts VALUES ('acc-1', 0, 0, 'default', 'int-1', '{}', NULL);
	`);
	const orm = createPluginOrm({
		database: createCorsairDatabase(sqlite),
		integrationName: 'chat',
		tenantId: 'default',
		schema: { version: '1.0.0', entities: { channels: ChannelSchema } },
	});
	return { orm, cleanup: () => sqlite.close() };
}

describe('entity search treats contains/startsWith/endsWith text literally', () => {
	let ctx: ReturnType<typeof setup>;

	beforeEach(async () => {
		ctx = setup();
		const rows: Array<[string, string]> = [
			['team_eng', 'team_eng'],
			['teamXeng', 'teams-eng'],
			['sale_100%', 'sale 100% off'],
			['sale_1000', 'sale 1000 units'],
		];
		for (const [entityId, name] of rows) {
			await ctx.orm.channels.upsertByEntityId(entityId, { name });
		}
	});

	afterEach(() => ctx.cleanup());

	const ids = (rows: Array<{ entity_id: string }>) =>
		rows.map((r) => r.entity_id).sort();

	test('underscore in startsWith matches only a literal underscore', async () => {
		const rows = await ctx.orm.channels.search({
			data: { name: { startsWith: 'team_' } },
		});
		expect(ids(rows)).toEqual(['team_eng']);
	});

	test('percent in contains matches only a literal percent', async () => {
		const rows = await ctx.orm.channels.search({
			data: { name: { contains: '100%' } },
		});
		expect(ids(rows)).toEqual(['sale_100%']);
	});

	test('endsWith on an entity column escapes wildcards too', async () => {
		const rows = await ctx.orm.channels.search({
			entity_id: { endsWith: '_eng' },
		});
		expect(ids(rows)).toEqual(['team_eng']);
	});

	test('plain substring search still works', async () => {
		const rows = await ctx.orm.channels.search({
			data: { name: { contains: 'eng' } },
		});
		expect(ids(rows)).toEqual(['teamXeng', 'team_eng']);
	});
});

describe('LIKE escape on Postgres', () => {
	test('binds the escape character instead of inlining a backslash literal', async () => {
		// With standard_conforming_strings=off, an inline `escape '\'` makes the
		// backslash escape the closing quote and the query fails to parse.
		const statements: string[] = [];
		const db = new Kysely<CorsairKyselyDatabase>({
			dialect: {
				createAdapter: () => new PostgresAdapter(),
				createDriver: () => new DummyDriver(),
				createIntrospector: (k) => new PostgresIntrospector(k),
				createQueryCompiler: () => new PostgresQueryCompiler(),
			},
			log: (event) => {
				statements.push(event.query.sql);
			},
		});
		const client = createKyselyEntityClient(
			db,
			async () => 'acc-1',
			'channels',
			'1.0.0',
			ChannelSchema,
		);
		await client.search({
			entity_id: { startsWith: 'C_' },
			data: { name: { contains: 'team_' } },
		});
		const sql = statements.join('\n');
		expect(sql).toMatch(/like \$\d+ escape \$\d+/);
		expect(sql).not.toContain("escape '\\'");
	});
});
