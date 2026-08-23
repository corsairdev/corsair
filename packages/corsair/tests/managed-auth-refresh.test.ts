import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
import { getManagedAccessToken } from '../hub/managed-auth';
import type { HubConfig } from '../hub/types';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

const hub: HubConfig = {
	apiUrl: 'https://hub.test',
	projectApiKey: 'ck_prod_test',
	signingSecret: 'sec',
};

async function seedManagedAccount(
	database: ReturnType<typeof createTestDatabase>['database'],
	account: Record<string, string>,
) {
	const now = new Date();
	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, KEK);

	await database.db
		.insertInto('corsair_integrations')
		.values({
			id: 'integration-linear',
			created_at: now,
			updated_at: now,
			name: 'linear',
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
			integration_id: 'integration-linear',
			config: encryptConfig(account, dek),
			dek: encryptedDek,
		})
		.execute();
}

function managedKeys(
	database: ReturnType<typeof createTestDatabase>['database'],
) {
	return createAccountKeyManager({
		authType: 'managed',
		integrationName: 'linear',
		tenantId: 'default',
		kek: KEK,
		database,
	});
}

function jsonResponse(body: unknown) {
	return {
		ok: true,
		status: 200,
		headers: { get: () => 'application/json' },
		text: async () => JSON.stringify(body),
	} as unknown as Response;
}

describe('getManagedAccessToken — stateless refresh (B4)', () => {
	const realFetch = global.fetch;
	afterEach(() => {
		global.fetch = realFetch;
	});

	it('sends its own refresh_token so Hub can mint statelessly', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedManagedAccount(database, {
				access_token: 'stale',
				expires_at: '1',
				refresh_token: 'managed-rt',
			});

			let sentBody: Record<string, unknown> | null = null;
			global.fetch = (async (_url: string, init: RequestInit) => {
				sentBody = JSON.parse(String(init.body));
				return jsonResponse({ access_token: 'rotated', expires_in: 3600 });
			}) as unknown as typeof fetch;

			const result = await getManagedAccessToken({
				keys: managedKeys(database),
				hub,
				plugin: 'linear',
				tenantId: 'default',
			});

			expect(result.accessToken).toBe('rotated');
			expect(sentBody).toEqual({
				plugin: 'linear',
				tenantId: 'default',
				refresh_token: 'managed-rt',
			});
		} finally {
			cleanup();
		}
	});

	it('collapses concurrent refreshes on one store into a single Hub mint', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedManagedAccount(database, {
				access_token: 'stale',
				expires_at: '1',
				refresh_token: 'managed-rt',
			});

			let calls = 0;
			global.fetch = (async () => {
				calls += 1;
				// Rotating provider: a second concurrent mint with the same
				// refresh_token would fail, so both callers must share one flight.
				return jsonResponse({
					access_token: 'rotated',
					refresh_token: 'managed-rt-2',
					expires_in: 3600,
				});
			}) as unknown as typeof fetch;

			const keys = managedKeys(database);
			const ctx = { keys, hub, plugin: 'linear', tenantId: 'default' };
			const [a, b] = await Promise.all([
				getManagedAccessToken(ctx),
				getManagedAccessToken(ctx),
			]);

			expect(a.accessToken).toBe('rotated');
			expect(b.accessToken).toBe('rotated');
			expect(calls).toBe(1);
		} finally {
			cleanup();
		}
	});

	it('collapses a concurrent forced (401) refresh and a routine refresh into one Hub mint', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedManagedAccount(database, {
				access_token: 'stale',
				expires_at: '1',
				refresh_token: 'managed-rt',
			});

			let calls = 0;
			global.fetch = (async () => {
				calls += 1;
				return jsonResponse({
					access_token: 'rotated',
					refresh_token: 'managed-rt-2',
					expires_in: 3600,
				});
			}) as unknown as typeof fetch;

			const keys = managedKeys(database);
			const ctx = { keys, hub, plugin: 'linear', tenantId: 'default' };
			// A 401 retry (forceRefresh) racing an expiry refresh must not spend the
			// rotating refresh_token twice — they share one flight.
			const [routine, forced] = await Promise.all([
				getManagedAccessToken(ctx),
				getManagedAccessToken(ctx, { forceRefresh: true }),
			]);

			expect(routine.accessToken).toBe('rotated');
			expect(forced.accessToken).toBe('rotated');
			expect(calls).toBe(1);
		} finally {
			cleanup();
		}
	});

	it('omits refresh_token for a legacy account that has none (Hub reads managed_connection)', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedManagedAccount(database, {
				access_token: 'stale',
				expires_at: '1',
			});

			let sentBody: Record<string, unknown> | null = null;
			global.fetch = (async (_url: string, init: RequestInit) => {
				sentBody = JSON.parse(String(init.body));
				return jsonResponse({ access_token: 'rotated', expires_in: 3600 });
			}) as unknown as typeof fetch;

			const result = await getManagedAccessToken({
				keys: managedKeys(database),
				hub,
				plugin: 'linear',
				tenantId: 'default',
			});

			expect(result.accessToken).toBe('rotated');
			expect(sentBody).toEqual({ plugin: 'linear', tenantId: 'default' });
		} finally {
			cleanup();
		}
	});
});
