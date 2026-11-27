import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { polymarket } from './index';

afterEach(() => {
	jest.restoreAllMocks();
});

const CLOB = {
	apiKey: '11111111-2222-3333-4444-555555555555',
	secret: 'MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=',
	passphrase: 'passphrase-value',
	address: '0x56687bf447db6ffa42ffe2204a05edaa20f55839',
};

describe('polymarket plugin', () => {
	it('declares api_key auth with the CLOB secret, passphrase and address as account config', () => {
		const plugin = polymarket();
		expect(plugin.id).toBe('polymarket');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['secret', 'passphrase', 'address'] },
		});
		expect(Object.keys(plugin.endpointMeta as object)).toHaveLength(276);
		expect(plugin.webhooks).toEqual({});
	});

	it('reads public market data and signs CLOB calls through createCorsair', async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async () => Response.json([]));
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'polymarket', 'default');
		const corsair = createCorsair({
			plugins: [polymarket({ clob: CLOB })],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		await corsair.polymarket.api.gamma.markets.list({ limit: 1 });
		await corsair.polymarket.api.clob.orders.list({});
		const [gammaUrl, gammaInit] = fetchSpy.mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(gammaUrl).toBe('https://gamma-api.polymarket.com/markets?limit=1');
		expect(new Headers(gammaInit.headers).get('poly_api_key')).toBeNull();
		const [clobUrl, clobInit] = fetchSpy.mock.calls[1] as [string, RequestInit];
		expect(clobUrl).toBe('https://clob.polymarket.com/data/orders');
		expect(new Headers(clobInit.headers).get('poly_api_key')).toBe(CLOB.apiKey);
		expect(new Headers(clobInit.headers).get('poly_signature')).toMatch(
			/^[A-Za-z0-9_-]+=*$/,
		);
		await testDb.cleanup?.();
	});

	it('builds the key from the stored set, and an empty key without one', async () => {
		const plugin = polymarket();
		const stored = {
			get_api_key: async () => CLOB.apiKey,
			get_secret: async () => CLOB.secret,
			get_passphrase: async () => CLOB.passphrase,
			get_address: async () => CLOB.address,
		};
		await expect(
			plugin.keyBuilder?.({ keys: stored } as never, 'endpoint'),
		).resolves.toBe(JSON.stringify({ clob: CLOB }));
		await expect(
			plugin.keyBuilder?.(
				{ keys: { ...stored, get_api_key: async () => null } } as never,
				'endpoint',
			),
		).resolves.toBe('');
		// The option wins over the stored set.
		const other = { ...CLOB, apiKey: 'option-key' };
		await expect(
			polymarket({ clob: other }).keyBuilder?.(
				{ keys: stored } as never,
				'endpoint',
			),
		).resolves.toBe(JSON.stringify({ clob: other }));
		await expect(
			plugin.keyBuilder?.({ keys: stored } as never, 'webhook'),
		).resolves.toBe('');
	});
});
