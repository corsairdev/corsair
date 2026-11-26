import { createCorsair } from '../core';
import { AuthMissingError } from '../core/auth/errors/auth-missing';
import type { CorsairTenantWrapper } from '../core/client';
import type { CorsairPlugin } from '../core/plugins';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

// An OAuth plugin with no stored token: every call needs a connection.
const demo = {
	id: 'demo',
	options: { authType: 'oauth_2' as const },
	authConfig: { oauth_2: { account: [] as const } },
	oauthConfig: {
		providerName: 'Demo',
		authUrl: 'https://demo.example/oauth/authorize',
	},
	schema: { version: '1', entities: {} },
	endpoints: { ping: async () => 'pong' },
	keyBuilder: async () => {
		throw new AuthMissingError('demo', 'oauth_2');
	},
} as unknown as CorsairPlugin;

type Ping = { demo: { api: { ping: () => Promise<unknown> } } };

describe('withTenant connectLinks option', () => {
	let env: ReturnType<typeof createTestDatabase>;
	let corsair: CorsairTenantWrapper<readonly [CorsairPlugin]>;

	beforeEach(() => {
		env = createTestDatabase();
		corsair = createCorsair({
			plugins: [demo],
			database: env.db,
			kek: KEK,
			multiTenancy: true,
			manual: {
				baseUrl: 'https://myapp.example/connect',
				redirectUri: 'https://myapp.example/api/callback',
			},
		}) as unknown as CorsairTenantWrapper<readonly [CorsairPlugin]>;
	});
	afterEach(() => env.cleanup());

	const ping = (scope: unknown) => (scope as Ping).demo.api.ping();

	it('gives the person a link by default', async () => {
		const err = await ping(corsair.withTenant('t1')).catch((e: unknown) => e);
		expect(err).toBeInstanceOf(AuthMissingError);
		expect((err as Error).message).toContain('https://myapp.example/connect');
	});

	it('fails without a link when the scope turns links off', async () => {
		const scope = corsair.withTenant('t1', { connectLinks: false });
		const err = await ping(scope).catch((e: unknown) => e);
		expect(err).toBeInstanceOf(AuthMissingError);
		expect(err).toMatchObject({ connectUrl: null, tenantId: 't1' });
		expect((err as Error).message).not.toContain('myapp.example/connect');
	});
});
