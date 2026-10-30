import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
import { getOAuthAccessToken } from '../core/auth/oauth-access';
import type { HubConfig } from '../hub/types';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

const hub: HubConfig = {
	apiUrl: 'https://hub.test',
	projectApiKey: 'ck_prod_test',
	signingSecret: 'sec',
};

async function seed(
	database: ReturnType<typeof createTestDatabase>['database'],
	integrationConfig: Record<string, string>,
	accountConfig: Record<string, string>,
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
			config: encryptConfig(integrationConfig, dek),
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
			config: encryptConfig(accountConfig, dek),
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

function jsonResponse(body: unknown) {
	return {
		ok: true,
		status: 200,
		headers: { get: () => 'application/json' },
		text: async () => JSON.stringify(body),
	} as unknown as Response;
}

describe('getOAuthAccessToken switchboard', () => {
	const realFetch = global.fetch;
	afterEach(() => {
		global.fetch = realFetch;
	});

	it('BYO+Hub (no local client_secret): refreshes through the hub', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seed(
				database,
				{}, // no client_secret stored locally → BYO+Hub
				{ access_token: 'stale', expires_at: '1', refresh_token: 'byo-rt' },
			);

			let sentUrl = '';
			let sentBody: Record<string, unknown> | null = null;
			global.fetch = (async (url: string, init: RequestInit) => {
				sentUrl = url;
				sentBody = JSON.parse(String(init.body));
				return jsonResponse({ access_token: 'hub-rotated', expires_in: 3600 });
			}) as unknown as typeof fetch;

			const keys = makeKeys(database);
			const ctx = { keys, hub, tenantId: 'default' };
			const token = await getOAuthAccessToken(ctx, {
				plugin: 'linear',
				tokenUrl: 'https://api.linear.app/oauth/token',
			});

			expect(token).toBe('hub-rotated');
			expect(sentUrl).toBe('https://hub.test/oauth/refresh');
			expect(sentBody).toEqual({
				plugin: 'linear',
				tenantId: 'default',
				refresh_token: 'byo-rt',
			});
			expect(typeof (ctx as Record<string, unknown>)._refreshAuth).toBe(
				'function',
			);
		} finally {
			cleanup();
		}
	});

	it('inline (local client_secret present): refreshes at the provider', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seed(
				database,
				{ client_id: 'cid', client_secret: 'csecret' },
				{ access_token: 'stale', expires_at: '1', refresh_token: 'local-rt' },
			);

			let sentUrl = '';
			let sentBody: Record<string, string> = {};
			global.fetch = (async (url: string, init: RequestInit) => {
				sentUrl = url;
				sentBody = Object.fromEntries(new URLSearchParams(String(init.body)));
				return jsonResponse({
					access_token: 'provider-rotated',
					refresh_token: 'local-rt-2',
					expires_in: 3600,
				});
			}) as unknown as typeof fetch;

			const keys = makeKeys(database);
			const ctx = { keys, tenantId: 'default' };
			const token = await getOAuthAccessToken(ctx, {
				plugin: 'linear',
				tokenUrl: 'https://api.linear.app/oauth/token',
			});

			expect(token).toBe('provider-rotated');
			expect(sentUrl).toBe('https://api.linear.app/oauth/token');
			expect(sentBody).toEqual({
				grant_type: 'refresh_token',
				refresh_token: 'local-rt',
				client_id: 'cid',
				client_secret: 'csecret',
			});
			expect(await keys.get_access_token()).toBe('provider-rotated');
			expect(await keys.get_refresh_token()).toBe('local-rt-2');
		} finally {
			cleanup();
		}
	});

	it('inline: returns the cached token without a refresh when still valid', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const farFuture = String(Math.floor(Date.now() / 1000) + 3600);
			await seed(
				database,
				{ client_id: 'cid', client_secret: 'csecret' },
				{ access_token: 'good', expires_at: farFuture, refresh_token: 'rt' },
			);

			let called = false;
			global.fetch = (async () => {
				called = true;
				return jsonResponse({ access_token: 'unused' });
			}) as unknown as typeof fetch;

			const keys = makeKeys(database);
			const token = await getOAuthAccessToken(
				{ keys, tenantId: 'default' },
				{ plugin: 'linear', tokenUrl: 'https://api.linear.app/oauth/token' },
			);

			expect(token).toBe('good');
			expect(called).toBe(false);
		} finally {
			cleanup();
		}
	});

	it('single-flights concurrent refreshes into one network call', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seed(
				database,
				{ client_id: 'cid', client_secret: 'csecret' },
				{ access_token: 'stale', expires_at: '1', refresh_token: 'rot-rt' },
			);

			let calls = 0;
			global.fetch = (async () => {
				calls += 1;
				// Rotating provider: the refresh_token is invalidated after first use,
				// so a second concurrent POST with the same token would fail.
				return jsonResponse({
					access_token: 'rotated',
					refresh_token: 'rot-rt-2',
					expires_in: 3600,
				});
			}) as unknown as typeof fetch;

			const keys = makeKeys(database);
			const ctx = { keys, tenantId: 'default' };
			const opts = {
				plugin: 'linear',
				tokenUrl: 'https://api.linear.app/oauth/token',
			};
			const [a, b] = await Promise.all([
				getOAuthAccessToken(ctx, opts),
				getOAuthAccessToken(ctx, opts),
			]);

			expect(a).toBe('rotated');
			expect(b).toBe('rotated');
			expect(calls).toBe(1);
		} finally {
			cleanup();
		}
	});

	it('_refreshAuth force-refreshes even when the local token still looks fresh', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const farFuture = String(Math.floor(Date.now() / 1000) + 3600);
			await seed(
				database,
				{ client_id: 'cid', client_secret: 'csecret' },
				{
					access_token: 'revoked-but-unexpired',
					expires_at: farFuture,
					refresh_token: 'rt',
				},
			);

			let calls = 0;
			global.fetch = (async () => {
				calls += 1;
				return jsonResponse({
					access_token: 'force-minted',
					refresh_token: 'rt-2',
					expires_in: 3600,
				});
			}) as unknown as typeof fetch;

			const keys = makeKeys(database);
			const ctx = { keys, tenantId: 'default' } as Record<string, unknown>;
			const first = await getOAuthAccessToken(
				ctx as { keys: typeof keys; tenantId: string },
				{ plugin: 'linear', tokenUrl: 'https://api.linear.app/oauth/token' },
			);
			// Locally fresh → returned as-is, no network.
			expect(first).toBe('revoked-but-unexpired');
			expect(calls).toBe(0);

			// Provider revoked it early: the 401 retry must mint a NEW token, not
			// replay the still-unexpired one.
			const refreshAuth = ctx._refreshAuth as () => Promise<string>;
			const forced = await refreshAuth();
			expect(forced).toBe('force-minted');
			expect(calls).toBe(1);
			expect(await keys.get_access_token()).toBe('force-minted');
		} finally {
			cleanup();
		}
	});

	it('a forced 401 refresh and a routine refresh share one flight (no double-spend)', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seed(
				database,
				{ client_id: 'cid', client_secret: 'csecret' },
				{ access_token: 'stale', expires_at: '1', refresh_token: 'rot-rt' },
			);

			const keys = makeKeys(database);
			const ctx = { keys, tenantId: 'default' } as Record<string, unknown>;
			const opts = {
				plugin: 'linear',
				tokenUrl: 'https://api.linear.app/oauth/token',
			};

			let calls = 0;
			let forced: Promise<string> | undefined;
			global.fetch = (async () => {
				calls += 1;
				// The routine refresh is now in flight (its flight is still open). A
				// concurrent 401 fires the forced refresh: it must JOIN this flight,
				// not start a second exchange of the same rotating refresh_token.
				if (!forced) {
					forced = (ctx._refreshAuth as () => Promise<string>)();
				}
				return jsonResponse({
					access_token: 'rotated',
					refresh_token: 'rot-rt-2',
					expires_in: 3600,
				});
			}) as unknown as typeof fetch;

			await getOAuthAccessToken(
				ctx as { keys: typeof keys; tenantId: string },
				opts,
			);
			await forced;

			expect(calls).toBe(1);
		} finally {
			cleanup();
		}
	});

	it('BYO+Hub: a forced 401 refresh and a routine refresh share one flight (no double-spend)', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seed(
				database,
				{}, // no client_secret → BYO+Hub
				{ access_token: 'stale', expires_at: '1', refresh_token: 'byo-rt' },
			);

			const keys = makeKeys(database);
			const ctx = { keys, hub, tenantId: 'default' } as Record<string, unknown>;
			const opts = {
				plugin: 'linear',
				tokenUrl: 'https://api.linear.app/oauth/token',
			};

			let calls = 0;
			let forced: Promise<string> | undefined;
			global.fetch = (async () => {
				calls += 1;
				// The routine hub refresh is in flight. A concurrent 401 fires the
				// forced refresh: it must JOIN this flight, not POST the same rotating
				// refresh_token to the hub a second time.
				if (!forced) {
					forced = (ctx._refreshAuth as () => Promise<string>)();
				}
				return jsonResponse({ access_token: 'hub-rotated', expires_in: 3600 });
			}) as unknown as typeof fetch;

			await getOAuthAccessToken(
				ctx as { keys: typeof keys; hub: typeof hub; tenantId: string },
				opts,
			);
			await forced;

			expect(calls).toBe(1);
		} finally {
			cleanup();
		}
	});

	it('throws AuthMissing when there is neither a local secret nor a hub', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seed(
				database,
				{},
				{ access_token: 'stale', expires_at: '1', refresh_token: 'rt' },
			);
			const keys = makeKeys(database);
			await expect(
				getOAuthAccessToken(
					{ keys, tenantId: 'default' },
					{ plugin: 'linear', tokenUrl: 'https://api.linear.app/oauth/token' },
				),
			).rejects.toThrow(/linear/);
		} finally {
			cleanup();
		}
	});
});
