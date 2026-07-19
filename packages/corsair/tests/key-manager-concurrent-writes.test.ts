import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

async function seedOutlookAccount(
	database: ReturnType<typeof createTestDatabase>['database'],
) {
	const now = new Date();
	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, KEK);

	await database.db
		.insertInto('corsair_integrations')
		.values({
			id: 'integration-outlook',
			created_at: now,
			updated_at: now,
			name: 'outlook',
			config: encryptConfig({}, dek),
			dek: encryptedDek,
		})
		.execute();

	await database.db
		.insertInto('corsair_accounts')
		.values({
			id: 'account-default',
			created_at: now,
			updated_at: now,
			tenant_id: 'default',
			integration_id: 'integration-outlook',
			// Non-empty config matters: the empty-config short-circuit in
			// getDecryptedConfig changes await interleaving and hides the race.
			config: encryptConfig(
				{ access_token: 'tok-old', expires_at: '1', refresh_token: 'r1' },
				dek,
			),
			dek: encryptedDek,
		})
		.execute();
}

describe('account key manager concurrent field writes', () => {
	it('does not lose one field when two setters run in parallel', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedOutlookAccount(database);
			const km = createAccountKeyManager({
				authType: 'oauth_2',
				integrationName: 'outlook',
				tenantId: 'default',
				kek: KEK,
				database,
			});

			// The outlook keyBuilder persists exactly like this after a refresh.
			await Promise.all([
				km.set_access_token('tok-fresh'),
				km.set_expires_at('1784999999'),
			]);

			expect(await km.get_access_token()).toBe('tok-fresh');
			expect(await km.get_expires_at()).toBe('1784999999');
		} finally {
			cleanup();
		}
	});
});
