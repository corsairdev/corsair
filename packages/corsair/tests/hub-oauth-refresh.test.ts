import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
import { getHubAccessToken } from '../hub/oauth-refresh';
import type { HubConfig } from '../hub/types';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

const hub: HubConfig = {
	apiUrl: 'https://hub.test',
	projectApiKey: 'ck_prod_test',
	signingSecret: 'sec',
};

async function seedLinearAccount(
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
			// BYO+Hub: no client_secret stored locally — it lives in the hub.
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

function makeKeys(database: ReturnType<typeof createTestDatabase>['database']) {
	return createAccountKeyManager({
		authType: 'oauth_2',
		integrationName: 'linear',
		tenantId: 'default',
		kek: KEK,
		database,
	});
}

// Minimal Response-like that satisfies readHubJsonResponse (headers.get + text).
function jsonResponse(body: unknown) {
	return {
		ok: true,
		status: 200,
		headers: { get: () => 'application/json' },
		text: async () => JSON.stringify(body),
	} as unknown as Response;
}

describe('getHubAccessToken — BYO+Hub stateless refresh', () => {
	const realFetch = global.fetch;
	afterEach(() => {
		global.fetch = realFetch;
	});

	it('refreshes an expired token through the hub and caches the rotated token', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedLinearAccount(database, {
				access_token: 'stale-access',
				expires_at: '1',
				refresh_token: 'byo-refresh-abc',
			});

			// The random string the hub "mints" — proves the pipe end to end.
			const rotatedAccess = 'rotated-access-7f2c9a';
			const rotatedRefresh = 'rotated-refresh-11d4';

			let sentBody: Record<string, unknown> | null = null;
			global.fetch = (async (_url: string, init: RequestInit) => {
				sentBody = JSON.parse(String(init.body));
				return jsonResponse({
					access_token: rotatedAccess,
					refresh_token: rotatedRefresh,
					expires_in: 3600,
					scope: 'read write',
				});
			}) as unknown as typeof fetch;

			const keys = makeKeys(database);
			const result = await getHubAccessToken({
				keys,
				hub,
				plugin: 'linear',
				tenantId: 'default',
			});

			expect(result.accessToken).toBe(rotatedAccess);
			expect(result.refreshed).toBe(true);

			// Mode-agnostic proof: the SDK sends its own refresh_token in the body.
			expect(sentBody).toEqual({
				plugin: 'linear',
				tenantId: 'default',
				refresh_token: 'byo-refresh-abc',
			});

			// Rotated tokens are cached locally for the next call.
			expect(await keys.get_access_token()).toBe(rotatedAccess);
			expect(await keys.get_refresh_token()).toBe(rotatedRefresh);
		} finally {
			cleanup();
		}
	});

	it('throws AuthMissing when the token is expired and there is no refresh_token', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedLinearAccount(database, {
				access_token: 'stale-access',
				expires_at: '1',
			});

			let called = false;
			global.fetch = (async () => {
				called = true;
				return jsonResponse({ access_token: 'unreachable' });
			}) as unknown as typeof fetch;

			const keys = makeKeys(database);
			await expect(
				getHubAccessToken({ keys, hub, plugin: 'linear', tenantId: 'default' }),
			).rejects.toThrow(/linear/);
			expect(called).toBe(false);
		} finally {
			cleanup();
		}
	});

	it('returns the cached token without calling the hub when still valid', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const farFuture = String(Math.floor(Date.now() / 1000) + 3600);
			await seedLinearAccount(database, {
				access_token: 'still-good',
				expires_at: farFuture,
				refresh_token: 'byo-refresh-abc',
			});

			let called = false;
			global.fetch = (async () => {
				called = true;
				return jsonResponse({ access_token: 'should-not-be-used' });
			}) as unknown as typeof fetch;

			const keys = makeKeys(database);
			const result = await getHubAccessToken({
				keys,
				hub,
				plugin: 'linear',
				tenantId: 'default',
			});

			expect(result.accessToken).toBe('still-good');
			expect(result.refreshed).toBe(false);
			expect(called).toBe(false);
		} finally {
			cleanup();
		}
	});
});
