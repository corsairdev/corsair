import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import {
	resolveAccountFromWebhookLink,
	resolveTenantFromWebhookLink,
	resolveTenantIdFromWebhookLink,
	resolveTenantIdFromWebhookMatches,
	setWebhookTenantLink,
} from '../webhooks/tenant-links';

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
	`);

	const db = new Kysely({
		dialect: new SqliteDialect({ database: sqlite }),
		plugins: [new SqliteDatePlugin()],
	});

	return {
		database: { db },
		destroy: async () => {
			await db.destroy();
			sqlite.close();
		},
	};
}

async function seedSlackIntegration(
	database: ReturnType<typeof createTestDatabase>['database'],
) {
	const now = new Date();
	const integrationId = 'slack-integration';
	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, KEK);

	await database.db
		.insertInto('corsair_integrations')
		.values({
			id: integrationId,
			created_at: now,
			updated_at: now,
			name: 'slack',
			config: {},
			dek: encryptedDek,
		})
		.execute();

	return { integrationId, dek };
}

async function seedSlackAccount(
	database: ReturnType<typeof createTestDatabase>['database'],
	tenantId: string,
	integrationId: string,
	dek: string,
) {
	const now = new Date();
	const accountId = `account-${tenantId}`;
	const encryptedDek = await encryptDEK(dek, KEK);

	await database.db
		.insertInto('corsair_accounts')
		.values({
			id: accountId,
			created_at: now,
			updated_at: now,
			tenant_id: tenantId,
			integration_id: integrationId,
			config: encryptConfig({}, dek),
			dek: encryptedDek,
		})
		.execute();
}

describe('webhook tenant links', () => {
	it('resolves tenant by decrypting the plugin link field on corsair_accounts', async () => {
		const { database, destroy } = createTestDatabase();
		try {
			const { integrationId, dek } = await seedSlackIntegration(database);
			await seedSlackAccount(database, 'tenant_a', integrationId, dek);
			await seedSlackAccount(database, 'tenant_b', integrationId, dek);

			await setWebhookTenantLink({
				database,
				kek: KEK,
				pluginId: 'slack',
				tenantId: 'tenant_a',
				link: { linkType: 'team_id', externalId: 'T111' },
			});
			await setWebhookTenantLink({
				database,
				kek: KEK,
				pluginId: 'slack',
				tenantId: 'tenant_b',
				link: { linkType: 'team_id', externalId: 'T222' },
			});

			const resolved = await resolveTenantIdFromWebhookLink({
				database,
				kek: KEK,
				pluginId: 'slack',
				linkType: 'team_id',
				externalId: 'T222',
			});

			expect(resolved).toBe('tenant_b');

			const account = await resolveAccountFromWebhookLink({
				database,
				kek: KEK,
				pluginId: 'slack',
				linkType: 'team_id',
				externalId: 'T111',
			});
			expect(account?.tenant_id).toBe('tenant_a');
			expect(account?.id).toBe('account-tenant_a');

			const viaMatch = await resolveTenantFromWebhookLink({
				database,
				kek: KEK,
				pluginId: 'slack',
				match: { linkType: 'team_id', externalId: 'T111' },
			});
			expect(viaMatch).toBe('tenant_a');
		} finally {
			await destroy();
		}
	});

	it('resolves ordered matches with precedence, falling back to the workspace link', async () => {
		const { database, destroy } = createTestDatabase();
		try {
			const { integrationId, dek } = await seedSlackIntegration(database);
			await seedSlackAccount(database, 'tenant_a', integrationId, dek);
			await seedSlackAccount(database, 'tenant_b', integrationId, dek);

			// Two tenants in the same workspace, each with its own user link.
			for (const [tenant, user] of [
				['tenant_a', 'U9'],
				['tenant_b', 'U8'],
			] as const) {
				await setWebhookTenantLink({
					database,
					kek: KEK,
					pluginId: 'slack',
					tenantId: tenant,
					link: { linkType: 'team_id', externalId: 'T111' },
				});
				await setWebhookTenantLink({
					database,
					kek: KEK,
					pluginId: 'slack',
					tenantId: tenant,
					link: { linkType: 'slack_user', externalId: `T111:${user}` },
				});
			}

			// User link wins over the shared workspace link.
			const u9 = await resolveTenantIdFromWebhookMatches({
				database,
				kek: KEK,
				pluginId: 'slack',
				matches: [
					{ linkType: 'slack_user', externalId: 'T111:U9' },
					{ linkType: 'team_id', externalId: 'T111' },
				],
			});
			expect(u9).toBe('tenant_a');

			// Unknown user falls back to the workspace link (some tenant in T111).
			const unknown = await resolveTenantIdFromWebhookMatches({
				database,
				kek: KEK,
				pluginId: 'slack',
				matches: [
					{ linkType: 'slack_user', externalId: 'T111:U404' },
					{ linkType: 'team_id', externalId: 'T111' },
				],
			});
			expect(unknown === 'tenant_a' || unknown === 'tenant_b').toBe(true);
		} finally {
			await destroy();
		}
	});
});
