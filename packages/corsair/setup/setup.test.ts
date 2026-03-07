// @ts-expect-error - better-sqlite3 types may not be available
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import type { CorsairKyselyDatabase } from '../db/kysely/database';
import { SqliteDatePlugin } from '../db/kysely/sqlite-date-plugin';
import { createCorsair } from '../core';
import { slack } from '../plugins/slack';
import { linear } from '../plugins/linear';
import { setupCorsair } from './index';

function createTestDb() {
	const sqlite = new Database(':memory:');

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

describe('setupCorsair', () => {
	let testDb: ReturnType<typeof createTestDb>;

	beforeEach(() => {
		testDb = createTestDb();
	});

	afterEach(() => {
		testDb.cleanup();
	});

	it('creates integration and account rows for each plugin', async () => {
		const corsair = createCorsair({
			kek: 'test-kek-32-chars-long-padding-x',
			plugins: [slack(), linear()],
			database: testDb.db,
		});

		await setupCorsair(corsair);

		const integrations = await testDb.db
			.selectFrom('corsair_integrations')
			.selectAll()
			.execute();

		expect(integrations).toHaveLength(2);
		expect(integrations.map((i) => i.name)).toContain('slack');
		expect(integrations.map((i) => i.name)).toContain('linear');

		const accounts = await testDb.db
			.selectFrom('corsair_accounts')
			.selectAll()
			.execute();

		expect(accounts).toHaveLength(2);
		expect(accounts.every((a) => a.tenant_id === 'default')).toBe(true);
	});

	it('issues DEKs for integrations and accounts', async () => {
		const corsair = createCorsair({
			kek: 'test-kek-32-chars-long-padding-x',
			plugins: [slack()],
			database: testDb.db,
		});

		await setupCorsair(corsair);

		const [integration] = await testDb.db
			.selectFrom('corsair_integrations')
			.selectAll()
			.execute();

		expect(integration?.dek).toBeTruthy();

		const [account] = await testDb.db
			.selectFrom('corsair_accounts')
			.selectAll()
			.execute();

		expect(account?.dek).toBeTruthy();
	});

	it('is idempotent — running twice does not create duplicate rows', async () => {
		const corsair = createCorsair({
			kek: 'test-kek-32-chars-long-padding-x',
			plugins: [slack()],
			database: testDb.db,
		});

		await setupCorsair(corsair);
		await setupCorsair(corsair);

		const integrations = await testDb.db
			.selectFrom('corsair_integrations')
			.selectAll()
			.execute();

		expect(integrations).toHaveLength(1);

		const accounts = await testDb.db
			.selectFrom('corsair_accounts')
			.selectAll()
			.execute();

		expect(accounts).toHaveLength(1);
	});

	it('warns (not throws) when a required table is missing', async () => {
		const sqlite = new Database(':memory:');
		// Only create integrations — leave out the rest
		sqlite.exec(`
			CREATE TABLE corsair_integrations (
				id TEXT PRIMARY KEY,
				created_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				name TEXT NOT NULL,
				config TEXT NOT NULL,
				dek TEXT NULL
			);
			CREATE TABLE corsair_accounts (
				id TEXT PRIMARY KEY,
				created_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				tenant_id TEXT NOT NULL,
				integration_id TEXT NOT NULL,
				config TEXT NOT NULL,
				dek TEXT NULL
			);
		`);
		const partialDb = new Kysely<CorsairKyselyDatabase>({
			dialect: new SqliteDialect({ database: sqlite }),
			plugins: [new SqliteDatePlugin()],
		});

		const corsair = createCorsair({
			kek: 'test-kek-32-chars-long-padding-x',
			plugins: [slack()],
			database: partialDb,
		});

		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

		// Should not throw even though some tables are missing
		await expect(setupCorsair(corsair)).resolves.toBeUndefined();

		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('corsair_entities'),
		);

		warnSpy.mockRestore();
		await partialDb.destroy();
		sqlite.close();
	});

	it('throws for multi-tenant instances', async () => {
		const corsair = createCorsair({
			kek: 'test-kek-32-chars-long-padding-x',
			plugins: [slack()],
			database: testDb.db,
			multiTenancy: true,
		});

		await expect(
			setupCorsair(corsair as any),
		).rejects.toThrow('multi-tenancy');
	});
});
