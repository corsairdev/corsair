// @ts-expect-error - better-sqlite3 types may not be available

import { slack } from '@corsair-dev/slack';
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import type { CorsairPlugin } from '../core';
import { createCorsair } from '../core';
import type { CorsairKyselyDatabase } from '../db/kysely/database';
import { SqliteDatePlugin } from '../db/kysely/sqlite-date-plugin';

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

describe('ensureTenantProvisioned', () => {
	let testDb: ReturnType<typeof createTestDb>;

	beforeEach(() => {
		testDb = createTestDb();
	});

	afterEach(() => {
		testDb.cleanup();
	});

	it('deduplicates concurrent provisioning per Corsair instance', async () => {
		const corsair = createCorsair({
			kek: 'test-kek-32-chars-long-padding-x',
			plugins: [slack({ authType: 'api_key' })],
			database: testDb.db,
			multiTenancy: true,
		});

		await Promise.all([
			corsair.withTenant('shared-tenant').slack.keys.get_api_key(),
			corsair.withTenant('shared-tenant').slack.keys.get_api_key(),
		]);

		const accounts = await testDb.db
			.selectFrom('corsair_accounts')
			.selectAll()
			.where('tenant_id', '=', 'shared-tenant')
			.execute();

		expect(accounts).toHaveLength(1);
	});

	it('does not share in-flight provisioning across Corsair instances', async () => {
		const slackPlugin = {
			id: 'slack-a',
			options: { authType: 'api_key' },
		} satisfies CorsairPlugin;
		const linearPlugin = {
			id: 'linear-b',
			options: { authType: 'api_key' },
		} satisfies CorsairPlugin;

		const corsairA = createCorsair({
			kek: 'test-kek-32-chars-long-padding-x',
			plugins: [slackPlugin],
			database: testDb.db,
			multiTenancy: true,
		});
		const corsairB = createCorsair({
			kek: 'test-kek-32-chars-long-padding-x',
			plugins: [linearPlugin],
			database: testDb.db,
			multiTenancy: true,
		});

		await Promise.all([
			corsairA.withTenant('shared-tenant')['slack-a'].keys.get_api_key(),
			corsairB.withTenant('shared-tenant')['linear-b'].keys.get_api_key(),
		]);

		const integrations = await testDb.db
			.selectFrom('corsair_integrations')
			.select('name')
			.execute();

		expect(integrations.map((row) => row.name).sort()).toEqual([
			'linear-b',
			'slack-a',
		]);
	});
});
