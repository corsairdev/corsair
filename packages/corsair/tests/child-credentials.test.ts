import { CORSAIR_INTERNAL } from '../core';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { collectTenantCredentials } from '../workflows/collect-credentials';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

async function seedApiKeyAccount(
	database: ReturnType<typeof createTestDatabase>['database'],
	tenantId: string,
	apiKey: string,
) {
	const now = new Date();
	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, KEK);
	const existing = await database.db
		.selectFrom('corsair_integrations')
		.selectAll()
		.where('name', '=', 'testkey')
		.executeTakeFirst();
	if (!existing) {
		await database.db
			.insertInto('corsair_integrations')
			.values({
				id: 'integration-testkey',
				created_at: now,
				updated_at: now,
				name: 'testkey',
				config: encryptConfig({}, dek),
				dek: encryptedDek,
			})
			.execute();
	}
	const integration = await database.db
		.selectFrom('corsair_integrations')
		.selectAll()
		.where('name', '=', 'testkey')
		.executeTakeFirstOrThrow();
	await database.db
		.insertInto('corsair_accounts')
		.values({
			id: `account-${tenantId}`,
			created_at: now,
			updated_at: now,
			tenant_id: tenantId,
			integration_id: integration.id,
			config: encryptConfig({ api_key: apiKey }, dek),
			dek: encryptedDek,
		})
		.execute();
}

function rootCorsair(
	database: ReturnType<typeof createTestDatabase>['database'],
) {
	return {
		[CORSAIR_INTERNAL]: {
			plugins: [{ id: 'testkey', options: { authType: 'api_key' } }],
			database,
			kek: KEK,
			multiTenancy: true,
		},
	};
}

describe('collectTenantCredentials', () => {
	it('decrypts only the requested tenant’s connected creds', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedApiKeyAccount(database, 'tenantA', 'A-secret');
			await seedApiKeyAccount(database, 'tenantB', 'B-secret');

			const scoped = await collectTenantCredentials(
				rootCorsair(database),
				'tenantA',
			);

			expect(scoped.credentialMap).toEqual({
				testkey: { api_key: 'A-secret' },
			});
			expect(JSON.stringify(scoped.credentialMap)).not.toContain('B-secret');
		} finally {
			cleanup();
		}
	});

	it('returns an empty map for a plugin the tenant has not connected', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const scoped = await collectTenantCredentials(
				rootCorsair(database),
				'tenantX',
			);
			expect(scoped.credentialMap).toEqual({});
		} finally {
			cleanup();
		}
	});
});
