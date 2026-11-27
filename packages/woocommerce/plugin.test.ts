import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { woocommerce } from './index';

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

describe('woocommerce plugin', () => {
	it('declares api_key auth with the site URL and consumer key as account config', () => {
		const plugin = woocommerce();
		expect(plugin.id).toBe('woocommerce');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['site_url', 'consumer_key'] },
		});
		expect(Object.keys(plugin.endpointMeta as object)).toHaveLength(155);
		expect(Object.keys(plugin.webhooks as object).sort()).toEqual([
			'action',
			'coupon',
			'customer',
			'order',
			'product',
		]);
	});

	it('calls through createCorsair with Basic auth over HTTPS', async () => {
		const fetchSpy = replyOnce({ id: 7, status: 'processing' });
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'woocommerce', 'default');
		const corsair = createCorsair({
			plugins: [
				woocommerce({
					key: 'cs_secret',
					siteUrl: 'https://shop.example.com',
					consumerKey: 'ck_key',
				}),
			],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		const order = await corsair.woocommerce.api.orders.get({ id: 7 });
		expect(order).toMatchObject({ status: 'processing' });
		const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://shop.example.com/wp-json/wc/v3/orders/7');
		expect(new Headers(init.headers).get('authorization')).toBe(
			`Basic ${Buffer.from('ck_key:cs_secret').toString('base64')}`,
		);
		await testDb.cleanup?.();
	});

	it('asks to connect when the secret, site or consumer key is missing', async () => {
		const plugin = woocommerce();
		const keys = {
			get_api_key: async () => null,
			get_site_url: async () => 'https://shop.example.com',
			get_consumer_key: async () => 'ck_key',
			get_webhook_signature: async () => 'stored-secret',
		};
		// `never` because the test builds only the fields keyBuilder reads.
		const ctx = { keys, authType: 'api_key', options: {} } as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toMatchObject({
			name: 'AuthMissingError',
		});
		const withKey = { ...keys, get_api_key: async () => 'cs' };
		await expect(
			plugin.keyBuilder?.(
				{ keys: { ...withKey, get_consumer_key: async () => null } } as never,
				'endpoint',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		await expect(
			plugin.keyBuilder?.({ keys: withKey } as never, 'endpoint'),
		).resolves.toBe('cs');
		await expect(plugin.keyBuilder?.(ctx, 'webhook')).resolves.toBe(
			'stored-secret',
		);
		await expect(
			woocommerce({ webhookSecret: 'opt' }).keyBuilder?.(ctx, 'webhook'),
		).resolves.toBe('opt');
	});

	it('never sends a stored secret to another store', async () => {
		const keys = {
			get_api_key: async () => 'stored',
			get_site_url: async () => 'https://shop.example.com',
			get_consumer_key: async () => 'ck_key',
			get_webhook_signature: async () => null,
		};
		const ctx = { keys, authType: 'api_key', options: {} } as never;
		await expect(
			woocommerce({ siteUrl: 'https://evil.example' }).keyBuilder?.(
				ctx,
				'endpoint',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		await expect(
			woocommerce({ siteUrl: 'https://shop.example.com/wp-json' }).keyBuilder?.(
				ctx,
				'endpoint',
			),
		).resolves.toBe('stored');
	});
});
