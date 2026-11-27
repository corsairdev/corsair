import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { netlify } from './index';

afterEach(() => {
	jest.restoreAllMocks();
});

function replyOnce(body: unknown) {
	return jest.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		}),
	);
}

describe('netlify plugin', () => {
	it('declares api_key auth, every operation and the four webhooks', () => {
		const plugin = netlify();
		expect(plugin.id).toBe('netlify');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(Object.keys(plugin.endpointMeta as object)).toHaveLength(185);
		expect(Object.keys(plugin.webhooks as object).sort()).toEqual([
			'deploy',
			'devServer',
			'splitTest',
			'submission',
		]);
	});

	it('calls through createCorsair with the key from options', async () => {
		const fetchSpy = replyOnce({ id: 'u1', email: 'ada@example.com' });
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'netlify', 'default');
		const corsair = createCorsair({
			plugins: [netlify({ key: 'nfp_opt' })],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		const me = await corsair.netlify.api.user.me({});
		expect(me).toMatchObject({ email: 'ada@example.com' });
		const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.netlify.com/api/v1/user');
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Bearer nfp_opt',
		);
		await testDb.cleanup?.();
	});

	it('asks to connect when no key is stored, and reads the webhook secret', async () => {
		const plugin = netlify();
		const keys = {
			get_api_key: async () => null,
			get_webhook_signature: async () => 'stored-secret',
		};
		// `never` because the test builds only the fields keyBuilder reads.
		const ctx = { keys, authType: 'api_key', options: {} } as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toMatchObject({
			name: 'AuthMissingError',
		});
		await expect(
			plugin.keyBuilder?.(
				{ keys: { ...keys, get_api_key: async () => 'nfp_stored' } } as never,
				'endpoint',
			),
		).resolves.toBe('nfp_stored');
		await expect(
			netlify({ key: 'nfp_opt' }).keyBuilder?.(ctx, 'endpoint'),
		).resolves.toBe('nfp_opt');
		await expect(plugin.keyBuilder?.(ctx, 'webhook')).resolves.toBe(
			'stored-secret',
		);
		await expect(
			netlify({ webhookSecret: 'opt' }).keyBuilder?.(ctx, 'webhook'),
		).resolves.toBe('opt');
	});

	it('builds schemas only when they are read', () => {
		const plugin = netlify();
		const entry = Object.getOwnPropertyDescriptor(
			plugin.endpointSchemas?.['sites.get'] ?? {},
			'input',
		);
		expect(typeof entry?.get).toBe('function');
	});
});
