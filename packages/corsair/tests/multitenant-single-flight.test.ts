import type { CorsairPlugin } from '../core';
import { createCorsair } from '../core';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { getOAuthAccessToken } from '../core/auth/oauth-access';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

const linearPlugin = {
	id: 'linear',
	options: { authType: 'oauth_2' },
} satisfies CorsairPlugin;

/**
 * Seeds one integration row plus one account row for a tenant, both
 * encrypted under a fresh DEK. Mirrors the production row layout so OAuth
 * refresh tests exercise the real decrypt/read/persist path.
 */
function seedTenant(
	database: ReturnType<typeof createTestDatabase>['database'],
	tenantId: string,
	accountConfig: Record<string, string>,
) {
	return (async () => {
		const now = new Date();
		const dek = generateDEK();
		const encryptedDek = await encryptDEK(dek, KEK);

		await database.db
			.insertInto('corsair_integrations')
			.values({
				id: `integration-${tenantId}`,
				created_at: now,
				updated_at: now,
				name: 'linear',
				config: encryptConfig(
					{ client_id: 'cid', client_secret: 'csecret' },
					dek,
				),
				dek: encryptedDek,
			})
			.execute();

		await database.db
			.insertInto('corsair_accounts')
			.values({
				id: `account-${tenantId}`,
				created_at: now,
				updated_at: now,
				tenant_id: tenantId,
				integration_id: `integration-${tenantId}`,
				config: encryptConfig(accountConfig, dek),
				dek: encryptedDek,
			})
			.execute();
	})();
}

/**
 * Builds a minimal fetch stub resolving with a JSON body. Only the surface
 * the token-refresh path touches (ok/status/headers/text) is stubbed; see
 * the inline note for why a real Response is not constructed per case.
 */
function jsonResponse(body: unknown) {
	// Narrow, documented stub: only ok/status/headers/text are exercised by
	// the token-refresh path under test, so a hand-built minimal Response
	// shape is sufficient — constructing a real Response per case adds
	// nothing and complicates the rotating-token assertions below.
	return {
		ok: true,
		status: 200,
		headers: { get: () => 'application/json' },
		text: async () => JSON.stringify(body),
	} as unknown as Response;
}

describe('multi-tenant singleFlight', () => {
	const realFetch = global.fetch;
	afterEach(() => {
		global.fetch = realFetch;
	});

	it('shares one key manager per tenant across withTenant() clients', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const corsair = createCorsair({
				kek: KEK,
				plugins: [linearPlugin],
				database: database.db,
				multiTenancy: true,
			});

			const first = corsair.withTenant('acme');
			const second = corsair.withTenant('acme');
			const other = corsair.withTenant('globex');

			expect(first.linear.keys).toBe(second.linear.keys);
			expect(first.linear.keys).not.toBe(other.linear.keys);
		} finally {
			cleanup();
		}
	});

	it('isolates key managers across Corsair instances', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const makeWrapper = () =>
				createCorsair({
					kek: KEK,
					plugins: [linearPlugin],
					database: database.db,
					multiTenancy: true,
				});

			const a = makeWrapper().withTenant('acme');
			const b = makeWrapper().withTenant('acme');

			// Same underlying Kysely instance, but each wrapper resolves its own
			// store — flights (and managers) must not leak across instances.
			expect(a.linear.keys).not.toBe(b.linear.keys);
		} finally {
			cleanup();
		}
	});

	it('single-flights concurrent refreshes from distinct withTenant() clients into one network call', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedTenant(database, 'acme', {
				access_token: 'stale',
				expires_at: '1',
				refresh_token: 'rot-rt',
			});

			let calls = 0;
			let releaseFetch: () => void = () => {};
			let notifyFetchStarted: () => void = () => {};
			const fetchStarted = new Promise<void>((resolve) => {
				notifyFetchStarted = resolve;
			});
			const fetchGate = new Promise<void>((resolve) => {
				releaseFetch = resolve;
			});
			// Documented stub (see jsonResponse above): replaces only the network
			// edge the refresh path touches; the rotating-token body is what the
			// single-flight assertion depends on. The gate keeps the first
			// flight's network call open until the second caller has started, so
			// the token is guaranteed still stale when it arrives: without the
			// gate, a fast provider could let the first caller persist a fresh
			// token before the second caller starts, and the test would observe
			// one network call even with the dedupe broken — a flaky pass rather
			// than a regression signal.
			global.fetch = (async () => {
				calls += 1;
				notifyFetchStarted();
				await fetchGate;
				// Rotating provider: the refresh_token is single-use, so a
				// second concurrent POST would fail and revoke the connection.
				return jsonResponse({
					access_token: 'rotated',
					refresh_token: 'rot-rt-2',
					expires_in: 3600,
				});
			}) as unknown as typeof fetch;

			const corsair = createCorsair({
				kek: KEK,
				plugins: [linearPlugin],
				database: database.db,
				multiTenancy: true,
			});

			// Two independent withTenant() calls, as parallel route handlers or
			// agent tools would hold them — distinct client objects.
			const opts = {
				plugin: 'linear',
				tokenUrl: 'https://api.linear.app/oauth/token',
			};
			const first = getOAuthAccessToken(
				{ keys: corsair.withTenant('acme').linear.keys, tenantId: 'acme' },
				opts,
			);
			// The first caller is inside its refresh flight with the network
			// call in-flight; the second caller must JOIN that flight.
			await fetchStarted;
			const second = getOAuthAccessToken(
				{ keys: corsair.withTenant('acme').linear.keys, tenantId: 'acme' },
				opts,
			);
			releaseFetch();
			const [a, b] = await Promise.all([first, second]);

			expect(a).toBe('rotated');
			expect(b).toBe('rotated');
			expect(calls).toBe(1);
		} finally {
			cleanup();
		}
	});

	it('bounds the per-scope manager cache: the oldest idle tenant is evicted past the cap', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const corsair = createCorsair({
				kek: KEK,
				plugins: [linearPlugin],
				database: database.db,
				multiTenancy: true,
			});

			// Manager creation is synchronous with no I/O, so flooding past
			// the 512-entry cap is cheap: the oldest idle tenants must be
			// dropped while recent ones stay shared.
			const first = corsair.withTenant('tenant-0').linear.keys;
			for (let i = 1; i < 600; i += 1) {
				corsair.withTenant(`tenant-${i}`);
			}
			const recent = corsair.withTenant('tenant-599').linear.keys;

			// tenant-0 was pushed out by newer idle entries and rebuilds.
			expect(corsair.withTenant('tenant-0').linear.keys).not.toBe(first);
			// A tenant still within the cap keeps its shared manager.
			expect(corsair.withTenant('tenant-599').linear.keys).toBe(recent);
		} finally {
			cleanup();
		}
	});
});
