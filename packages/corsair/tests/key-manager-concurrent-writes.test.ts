import {
	decryptDEK,
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

	// Companion to the account re-read test above: integration rows
	// (client_secret et al.) are rotated out-of-band by re-provisioning, and
	// the shared per-tenant managers introduced for OAuth single-flight live
	// as long as the wrapper. A memoized integration row would keep minting
	// refreshes against revoked credentials until process restart.
	it('re-reads the integration so an out-of-band credential rotation is observed', async () => {
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
			// Populate any per-manager integration caches (the seed carries
			// an empty integration config, so no secret is present yet).
			const before = await reader.get_integration_credentials();
			expect(before.client_secret).toBeNull();

			// Rotate one integration field out-of-band, re-encrypting under
			// the same DEK exactly as re-provisioning would persist it.
			const row = await database.db
				.selectFrom('corsair_integrations')
				.selectAll()
				.where('name', '=', 'outlook')
				.executeTakeFirstOrThrow();
			const dek = await decryptDEK(row.dek as string, KEK);
			await database.db
				.updateTable('corsair_integrations')
				.set({
					config: encryptConfig(
						{ client_id: 'cid', client_secret: 'rotated-secret' },
						dek,
					),
					updated_at: new Date(),
				})
				.where('id', '=', row.id)
				.execute();

			const after = await reader.get_integration_credentials();
			expect(after.client_secret).toBe('rotated-secret');
		} finally {
			cleanup();
		}
	});

	it('re-decrypts when the integration DEK itself is rotated out-of-band', async () => {
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
			await reader.get_integration_credentials();

			// Full DEK rotation: new DEK, config re-encrypted under it, both
			// columns rewritten. A source-unaware DEK cache would decrypt the
			// new config with the old DEK and fail.
			const row = await database.db
				.selectFrom('corsair_integrations')
				.selectAll()
				.where('name', '=', 'outlook')
				.executeTakeFirstOrThrow();
			const newDek = generateDEK();
			await database.db
				.updateTable('corsair_integrations')
				.set({
					config: encryptConfig(
						{ client_id: 'cid', client_secret: 'post-rotation-secret' },
						newDek,
					),
					dek: await encryptDEK(newDek, KEK),
					updated_at: new Date(),
				})
				.where('id', '=', row.id)
				.execute();

			const after = await reader.get_integration_credentials();
			expect(after.client_secret).toBe('post-rotation-secret');
		} finally {
			cleanup();
		}
	});
});
