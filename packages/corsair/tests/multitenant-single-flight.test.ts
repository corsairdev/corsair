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

function jsonResponse(body: unknown) {
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
			global.fetch = (async () => {
				calls += 1;
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
			const [a, b] = await Promise.all([
				getOAuthAccessToken(
					{ keys: corsair.withTenant('acme').linear.keys, tenantId: 'acme' },
					opts,
				),
				getOAuthAccessToken(
					{ keys: corsair.withTenant('acme').linear.keys, tenantId: 'acme' },
					opts,
				),
			]);

			expect(a).toBe('rotated');
			expect(b).toBe('rotated');
			expect(calls).toBe(1);
		} finally {
			cleanup();
		}
	});
});
