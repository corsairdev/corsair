import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

async function seedAccount(
	database: ReturnType<typeof createTestDatabase>['database'],
) {
	const now = new Date();
	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, KEK);

	await database.db
		.insertInto('corsair_integrations')
		.values({
			id: 'integration-notion',
			created_at: now,
			updated_at: now,
			name: 'notion',
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
			integration_id: 'integration-notion',
			config: encryptConfig({ access_token: 'tok' }, dek),
			dek: encryptedDek,
		})
		.execute();
}

function makeManager(
	database: ReturnType<typeof createTestDatabase>['database'],
) {
	return createAccountKeyManager({
		authType: 'oauth_2',
		integrationName: 'notion',
		tenantId: 'default',
		kek: KEK,
		database,
	});
}

describe('set_webhook_signature_if_absent', () => {
	it('creates the signature when none is stored', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database);
			const km = makeManager(database);

			await expect(
				km.set_webhook_signature_if_absent('secret-a'),
			).resolves.toEqual({ created: true });
			expect(await km.get_webhook_signature()).toBe('secret-a');
		} finally {
			cleanup();
		}
	});

	it('is a no-op when the same secret is already stored', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database);
			const km = makeManager(database);
			await km.set_webhook_signature('secret-a');

			await expect(
				km.set_webhook_signature_if_absent('secret-a'),
			).resolves.toEqual({ created: false });
			expect(await km.get_webhook_signature()).toBe('secret-a');
		} finally {
			cleanup();
		}
	});

	it('rejects a different secret when one is already stored', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database);
			const km = makeManager(database);
			await km.set_webhook_signature('secret-a');

			await expect(
				km.set_webhook_signature_if_absent('secret-b'),
			).rejects.toThrow('Webhook signature already configured');
			expect(await km.get_webhook_signature()).toBe('secret-a');
		} finally {
			cleanup();
		}
	});

	it('rejects an empty or whitespace-only signature', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database);
			const km = makeManager(database);

			await expect(km.set_webhook_signature_if_absent('')).rejects.toThrow(
				'Webhook signature cannot be empty',
			);
			await expect(km.set_webhook_signature_if_absent('   ')).rejects.toThrow(
				'Webhook signature cannot be empty',
			);
		} finally {
			cleanup();
		}
	});

	it('lets only one of two concurrent managers create the first secret', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database);
			const a = makeManager(database);
			const b = makeManager(database);

			const results = await Promise.allSettled([
				a.set_webhook_signature_if_absent('secret-a'),
				b.set_webhook_signature_if_absent('secret-b'),
			]);

			const fulfilled = results.filter((r) => r.status === 'fulfilled');
			const rejected = results.filter((r) => r.status === 'rejected');

			expect(fulfilled).toHaveLength(1);
			expect(rejected).toHaveLength(1);
			expect(
				(fulfilled[0] as PromiseFulfilledResult<{ created: boolean }>).value,
			).toEqual({
				created: true,
			});
			expect((rejected[0] as PromiseRejectedResult).reason).toEqual(
				expect.objectContaining({
					message: 'Webhook signature already configured',
				}),
			);

			const stored = await a.get_webhook_signature();
			expect(stored === 'secret-a' || stored === 'secret-b').toBe(true);
		} finally {
			cleanup();
		}
	});

	it('does not let a concurrent set_* wipe a just-created signature', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database);
			const registrar = makeManager(database);
			const tokenWriter = makeManager(database);

			await Promise.all([
				registrar.set_webhook_signature_if_absent('secret-a'),
				tokenWriter.set_access_token('tok-fresh'),
			]);

			expect(await registrar.get_webhook_signature()).toBe('secret-a');
			expect(await tokenWriter.get_access_token()).toBe('tok-fresh');
		} finally {
			cleanup();
		}
	});

	it('does not let a concurrent issue_new_dek wipe a just-created signature', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database);
			const registrar = makeManager(database);
			const rotator = makeManager(database);

			await Promise.all([
				registrar.set_webhook_signature_if_absent('secret-a'),
				rotator.issue_new_dek(),
			]);

			expect(await registrar.get_webhook_signature()).toBe('secret-a');
			expect(await registrar.get_access_token()).toBe('tok');
		} finally {
			cleanup();
		}
	});

	it('refuses issue_new_dek when config exists without a DEK', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database);
			const before = await database.db
				.selectFrom('corsair_accounts')
				.select(['config', 'dek'])
				.where('id', '=', 'account-default')
				.executeTakeFirstOrThrow();

			await database.db
				.updateTable('corsair_accounts')
				.set({ dek: null })
				.where('id', '=', 'account-default')
				.execute();

			const km = makeManager(database);
			await expect(km.issue_new_dek()).rejects.toThrow(
				/encrypted config but no DEK/,
			);

			const after = await database.db
				.selectFrom('corsair_accounts')
				.select(['config', 'dek'])
				.where('id', '=', 'account-default')
				.executeTakeFirstOrThrow();

			expect(after.config).toEqual(before.config);
			expect(after.dek).toBeNull();
		} finally {
			cleanup();
		}
	});

	it('does not write when the stored config cannot be decrypted', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database);
			const wrongDek = generateDEK();
			await database.db
				.updateTable('corsair_accounts')
				.set({
					config: encryptConfig({ access_token: 'tok' }, wrongDek),
				})
				.where('id', '=', 'account-default')
				.execute();

			const before = await database.db
				.selectFrom('corsair_accounts')
				.select('config')
				.where('id', '=', 'account-default')
				.executeTakeFirstOrThrow();

			const km = makeManager(database);
			const error = jest.spyOn(console, 'error').mockImplementation(() => {});

			await expect(
				km.set_webhook_signature_if_absent('secret-a'),
			).rejects.toThrow();

			const after = await database.db
				.selectFrom('corsair_accounts')
				.select('config')
				.where('id', '=', 'account-default')
				.executeTakeFirstOrThrow();

			expect(after.config).toEqual(before.config);

			error.mockRestore();
		} finally {
			cleanup();
		}
	});
});
