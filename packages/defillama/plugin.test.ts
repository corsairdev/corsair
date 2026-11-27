import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { defillama } from './index';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('defillama plugin', () => {
	it('declares api_key auth with no account fields and no webhooks', () => {
		const plugin = defillama();
		expect(plugin.id).toBe('defillama');
		expect(plugin.authConfig).toEqual({ api_key: { account: [] } });
		expect(Object.keys(plugin.endpointMeta as object)).toHaveLength(136);
		expect(plugin.webhooks).toEqual({});
	});

	it('reads free data without a key and Pro data with one through createCorsair', async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async () => Response.json([]));
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'defillama', 'default');
		const free = createCorsair({
			plugins: [defillama()],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		await free.defillama.api.tvl.protocols({});
		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
			'https://api.llama.fi/protocols',
		);
		const pro = createCorsair({
			plugins: [defillama({ key: 'pro-key' })],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		await pro.defillama.api.tvl.protocols({});
		expect(String(fetchSpy.mock.calls[1]?.[0])).toBe(
			'https://pro-api.llama.fi/pro-key/api/protocols',
		);
		await testDb.cleanup?.();
	});

	it('builds the key from the option, the stored key or nothing', async () => {
		const stored = { get_api_key: async () => 'stored-key' };
		await expect(
			defillama().keyBuilder?.({ keys: stored } as never, 'endpoint'),
		).resolves.toBe('stored-key');
		await expect(
			defillama({ key: 'option-key' }).keyBuilder?.(
				{ keys: stored } as never,
				'endpoint',
			),
		).resolves.toBe('option-key');
		await expect(
			defillama().keyBuilder?.(
				{ keys: { get_api_key: async () => null } } as never,
				'endpoint',
			),
		).resolves.toBe('');
	});
});
