import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { clearPaypalTokens } from './client';
import { paypal } from './index';

afterEach(() => {
	jest.restoreAllMocks();
	clearPaypalTokens();
});

describe('paypal plugin', () => {
	it('declares api_key auth with the client id and environment as account config', () => {
		const plugin = paypal();
		expect(plugin.id).toBe('paypal');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['client_id', 'environment'] },
		});
		expect(Object.keys(plugin.endpointMeta as object)).toHaveLength(114);
		expect(Object.keys(plugin.webhooks as object)).toHaveLength(12);
	});

	it('gets a token and calls through createCorsair', async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async (input) =>
				String(input).endsWith('/v1/oauth2/token')
					? Response.json({ access_token: 'A21AA-token', expires_in: 32400 })
					: Response.json({ id: '5O190127TN364715T', status: 'CREATED' }),
			);
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'paypal', 'default');
		const corsair = createCorsair({
			plugins: [
				paypal({ key: 'secret', clientId: 'client', environment: 'sandbox' }),
			],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		const order = await corsair.paypal.api.orders.get({
			id: '5O190127TN364715T',
		});
		expect(order).toMatchObject({ status: 'CREATED' });
		const [tokenUrl, tokenInit] = fetchSpy.mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(tokenUrl).toBe('https://api-m.sandbox.paypal.com/v1/oauth2/token');
		expect(new Headers(tokenInit.headers).get('authorization')).toBe(
			`Basic ${Buffer.from('client:secret').toString('base64')}`,
		);
		const [url, init] = fetchSpy.mock.calls[1] as [string, RequestInit];
		expect(url).toBe(
			'https://api-m.sandbox.paypal.com/v2/checkout/orders/5O190127TN364715T',
		);
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Bearer A21AA-token',
		);
		await testDb.cleanup?.();
	});

	it('asks to connect when the secret or client id is missing', async () => {
		const plugin = paypal();
		const keys = {
			get_api_key: async () => null,
			get_client_id: async () => 'client',
			get_environment: async () => null,
			get_webhook_signature: async () => 'WH-stored',
		};
		// `never` because the test builds only the fields keyBuilder reads.
		const ctx = { keys, authType: 'api_key', options: {} } as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toMatchObject({
			name: 'AuthMissingError',
		});
		await expect(
			plugin.keyBuilder?.(
				{
					keys: {
						...keys,
						get_api_key: async () => 's',
						get_client_id: async () => null,
					},
				} as never,
				'endpoint',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		await expect(
			plugin.keyBuilder?.(
				{ keys: { ...keys, get_api_key: async () => 's' } } as never,
				'endpoint',
			),
		).resolves.toBe('s');
		await expect(plugin.keyBuilder?.(ctx, 'webhook')).resolves.toBe(
			'WH-stored',
		);
		await expect(
			paypal({ webhookId: 'WH-opt' }).keyBuilder?.(ctx, 'webhook'),
		).resolves.toBe('WH-opt');
	});
});
