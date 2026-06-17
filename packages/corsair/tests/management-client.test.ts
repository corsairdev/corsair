import { CorsairClientError, createCorsairClient } from '../client';
import { createCorsair } from '../core';
import { managementHandler } from '../core/management';
import type { CorsairPlugin } from '../core/plugins';
import { createTestDatabase } from './setup-db';

// ─────────────────────────────────────────────────────────────────────────────
// Client/handler integration. We don't spin up a TCP server — instead we wire
// the client's `fetch` to invoke the handler directly with a Request. That
// exercises the full URL building, body serialization, and error parsing path
// without the cost of an HTTP socket.
// ─────────────────────────────────────────────────────────────────────────────

const slackOAuth = {
	id: 'slack',
	options: { authType: 'oauth_2' as const },
	oauthConfig: {
		providerName: 'Slack',
		authUrl: 'https://slack.com/oauth/v2/authorize',
		tokenUrl: 'https://slack.com/api/oauth.v2.access',
		scopes: ['chat:write'],
	},
} as unknown as CorsairPlugin;

const KEK = 'test-kek-management-client';
const BASE = 'http://test.local/api/corsair';

function makeClient(corsair: unknown) {
	const handler = managementHandler(corsair);
	const fetchImpl: typeof fetch = async (input, init) => {
		const req = new Request(
			input instanceof Request ? input.url : String(input),
			init,
		);
		return handler(req);
	};
	return createCorsairClient({ baseURL: BASE, fetch: fetchImpl });
}

describe('createCorsairClient — round-trip', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('ok() returns { ok: true }', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const client = makeClient(corsair);
		expect(await client.ok()).toEqual({ ok: true });
	});

	it('plugins.list and plugins.get pass through', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const client = makeClient(corsair);

		const list = await client.plugins.list();
		expect(list).toHaveLength(1);
		expect(list[0]!.id).toBe('slack');

		const one = await client.plugins.get('slack');
		expect(one.id).toBe('slack');
	});

	it('tenants.create + tenants.list + tenants.get', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const client = makeClient(corsair);

		const created = await client.tenants.create({ id: 'team-a' });
		expect(created.id).toBe('team-a');

		const list = await client.tenants.list();
		expect(list.map((t) => t.id)).toContain('default');

		const got = await client.tenants.get('team-a');
		expect(got.id).toBe('team-a');
	});

	it('throws CorsairClientError on bad request, preserving missingFields', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const client = makeClient(corsair);

		await expect(client.tenants.create({ id: '' })).rejects.toMatchObject({
			name: 'CorsairClientError',
			status: 400,
			code: 'bad_request',
			extra: { missingFields: ['id'] },
		});
	});

	it('connectionStatus.get sends tenantId as a query param', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const client = makeClient(corsair);
		const status = await client.connectionStatus.get({ tenantId: 'team-a' });
		expect(status.slack).toBe('missing_credentials');
	});

	it('permissions.get 404 surfaces as a CorsairClientError', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);

		// permissions table doesn't exist in setup-db; the operation should still
		// 404 because the underlying lookup throws ManagementApiError(404) when
		// the DB call fails. We verify the client surfaces it cleanly.
		const client = makeClient(corsair);
		await expect(client.permissions.get('nope')).rejects.toBeInstanceOf(
			CorsairClientError,
		);
	});
});
