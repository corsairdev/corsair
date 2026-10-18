import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { AuthMissingError } from '../core/auth/errors/auth-missing';
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

	it('collapses concurrent refreshes across two key managers on one database', async () => {
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
				await new Promise((resolve) => setTimeout(resolve, 20));
				return jsonResponse({
					access_token: 'rotated',
					refresh_token: 'managed-rt-2',
					expires_in: 3600,
				});
			}) as unknown as typeof fetch;

			// Two withTenant() clients: separate managers, one database. The manager
			// carries the shared store, so both join the same Hub mint.
			const options = { hub, plugin: 'linear', tenantId: 'default' };
			const [a, b] = await Promise.all([
				getManagedAccessToken({ keys: managedKeys(database), ...options }),
				getManagedAccessToken({ keys: managedKeys(database), ...options }),
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

	it('throws AuthMissingError when a refresh is needed but no refresh_token exists (Hub stores no managed tokens)', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedManagedAccount(database, {
				access_token: 'stale',
				expires_at: '1',
			});

			let called = false;
			// The refresh path only reads ok/status/headers/text; stubbing the
			// full Response surface would add noise without tightening the test.
			global.fetch = (async () => {
				called = true;
				return jsonResponse({ access_token: 'rotated', expires_in: 3600 });
			}) as unknown as typeof fetch;

			await expect(
				getManagedAccessToken({
					keys: managedKeys(database),
					hub,
					plugin: 'linear',
					tenantId: 'default',
				}),
			).rejects.toBeInstanceOf(AuthMissingError);
			expect(called).toBe(false);
		} finally {
			cleanup();
		}
	});

	it('mints for a forced caller that joined a routine flight on a locally fresh token', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const farFuture = String(Math.floor(Date.now() / 1000) + 3600);
			await seedManagedAccount(database, {
				access_token: 'revoked-but-unexpired',
				expires_at: farFuture,
				refresh_token: 'managed-rt',
			});

			let calls = 0;
			// The refresh path only reads ok/status/headers/text; stubbing the
			// full Response surface would add noise without tightening the test.
			global.fetch = (async () => {
				calls += 1;
				await new Promise((resolve) => setTimeout(resolve, 20));
				return jsonResponse({
					access_token: 'force-minted',
					refresh_token: 'managed-rt-2',
					expires_in: 3600,
				});
			}) as unknown as typeof fetch;

			// The routine call opens the flight and short-circuits on the locally
			// fresh token; the forced 401 caller joins that flight and must not
			// inherit the token it just saw rejected.
			const slowKeys = managedKeys(database);
			const realGetExpiresAt = slowKeys.get_expires_at;
			slowKeys.get_expires_at = async () => {
				await new Promise((resolve) => setTimeout(resolve, 50));
				return realGetExpiresAt();
			};
			const routine = getManagedAccessToken({
				keys: slowKeys,
				hub,
				plugin: 'linear',
				tenantId: 'default',
			});
			await new Promise((resolve) => setTimeout(resolve, 10));
			const forced = await getManagedAccessToken(
				{
					keys: managedKeys(database),
					hub,
					plugin: 'linear',
					tenantId: 'default',
				},
				{ forceRefresh: true },
			);
			const routineResult = await routine;

			expect(routineResult.accessToken).toBe('revoked-but-unexpired');
			expect(routineResult.refreshed).toBe(false);
			expect(forced.accessToken).toBe('force-minted');
			expect(forced.refreshed).toBe(true);
			expect(calls).toBe(1);
		} finally {
			cleanup();
		}
	});

	it('keeps a forced retry on the shared flight when a new routine caller races it', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const farFuture = String(Math.floor(Date.now() / 1000) + 3600);
			await seedManagedAccount(database, {
				access_token: 'revoked-but-unexpired',
				expires_at: farFuture,
				refresh_token: 'managed-rt',
			});

			let calls = 0;
			// The refresh path only reads ok/status/headers/text; stubbing the
			// full Response surface would add noise without tightening the test.
			global.fetch = (async () => {
				calls += 1;
				await new Promise((resolve) => setTimeout(resolve, 20));
				return jsonResponse({
					access_token: 'force-minted',
					refresh_token: 'managed-rt-2',
					expires_in: 3600,
				});
			}) as unknown as typeof fetch;

			// Routine A opens the first flight and keeps it open while it reads the
			// locally fresh token.
			const slowFresh = managedKeys(database);
			const realGetExpiresAt = slowFresh.get_expires_at;
			slowFresh.get_expires_at = async () => {
				await new Promise((resolve) => setTimeout(resolve, 50));
				return realGetExpiresAt();
			};
			const routineA = getManagedAccessToken({
				keys: slowFresh,
				hub,
				plugin: 'linear',
				tenantId: 'default',
			});
			await new Promise((resolve) => setTimeout(resolve, 10));

			// The forced caller joins A, gets refreshed false, and retries.
			const forced = getManagedAccessToken(
				{
					keys: managedKeys(database),
					hub,
					plugin: 'linear',
					tenantId: 'default',
				},
				{ forceRefresh: true },
			);

			// Routine B sees a stale token and starts or joins a refresh at the same
			// time, so a separate forced key would mint twice.
			await new Promise((resolve) => setTimeout(resolve, 45));
			const staleKeys = managedKeys(database);
			staleKeys.get_expires_at = async () => '1';
			const routineB = getManagedAccessToken({
				keys: staleKeys,
				hub,
				plugin: 'linear',
				tenantId: 'default',
			});

			const [a, f, b] = await Promise.all([routineA, forced, routineB]);

			expect(a.accessToken).toBe('revoked-but-unexpired');
			expect(a.refreshed).toBe(false);
			expect(f.refreshed).toBe(true);
			expect(b.refreshed).toBe(true);
			expect(calls).toBe(1);
		} finally {
			cleanup();
		}
	});
});
