import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import {
	createAccountKeyManager,
	createIntegrationKeyManager,
} from '../core/auth/key-manager';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

async function seedOutlookAccount(
	database: ReturnType<typeof createTestDatabase>['database'],
): Promise<string> {
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

	return dek;
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

	// Regression: a long-lived manager (kept alive by the /call client cache) must
	// not serve a token snapshot from its first read after the account is rewritten
	// out-of-band (reconnect / Hub token (re)delivery). Before the account-row
	// re-read fix this returned the stale token → AuthMissingError → "needs reconnect"
	// even though the DB held a valid one.
	it('re-reads the account so an out-of-band token write is observed', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedOutlookAccount(database);
			const reader = createAccountKeyManager({
				authType: 'oauth_2',
				integrationName: 'outlook',
				tenantId: 'default',
				kek: KEK,
				database,
			});
			// First read populates any per-manager cache with the seeded token.
			expect(await reader.get_access_token()).toBe('tok-old');

			// A separate manager rewrites the token, as Hub delivery does on reconnect.
			const writer = createAccountKeyManager({
				authType: 'oauth_2',
				integrationName: 'outlook',
				tenantId: 'default',
				kek: KEK,
				database,
			});
			await writer.set_access_token('tok-new');

			// The original manager must observe the new token, not its snapshot.
			expect(await reader.get_access_token()).toBe('tok-new');
		} finally {
			cleanup();
		}
	});
});

describe('key manager decryption failures', () => {
	it('does not overwrite integration config when it cannot be decrypted', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const dek = await seedOutlookAccount(database);
			const corruptedConfig = {
				client_id: encryptConfig({ value: 'client-id' }, dek).value,
				client_secret: 'corrupted-value',
			};
			await database.db
				.updateTable('corsair_integrations')
				.set({ config: corruptedConfig })
				.where('name', '=', 'outlook')
				.execute();
			const storedConfigBeforeUpdate = await database.db
				.selectFrom('corsair_integrations')
				.select('config')
				.where('name', '=', 'outlook')
				.executeTakeFirstOrThrow();

			const km = createIntegrationKeyManager({
				authType: 'oauth_2',
				integrationName: 'outlook',
				kek: KEK,
				database,
			});

			await expect(km.set_client_id('replacement-client-id')).rejects.toThrow();

			const integration = await database.db
				.selectFrom('corsair_integrations')
				.select('config')
				.where('name', '=', 'outlook')
				.executeTakeFirstOrThrow();
			expect(integration.config).toEqual(storedConfigBeforeUpdate.config);
		} finally {
			cleanup();
		}
	});

	it('does not overwrite account config when it cannot be decrypted', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedOutlookAccount(database);
			const corruptedConfig = {
				access_token: 'corrupted-value',
				refresh_token: 'also-corrupted-value',
			};
			await database.db
				.updateTable('corsair_accounts')
				.set({ config: corruptedConfig })
				.where('id', '=', 'account-default')
				.execute();
			const storedConfigBeforeUpdate = await database.db
				.selectFrom('corsair_accounts')
				.select('config')
				.where('id', '=', 'account-default')
				.executeTakeFirstOrThrow();

			const km = createAccountKeyManager({
				authType: 'oauth_2',
				integrationName: 'outlook',
				tenantId: 'default',
				kek: KEK,
				database,
			});

			await expect(km.set_access_token('replacement-token')).rejects.toThrow();

			const account = await database.db
				.selectFrom('corsair_accounts')
				.select('config')
				.where('id', '=', 'account-default')
				.executeTakeFirstOrThrow();
			expect(account.config).toEqual(storedConfigBeforeUpdate.config);
		} finally {
			cleanup();
		}
	});
});
