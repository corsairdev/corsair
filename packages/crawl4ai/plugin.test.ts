import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { crawl4ai } from './index';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('crawl4ai plugin', () => {
	it('declares api_key auth with the server URL as account config', () => {
		const plugin = crawl4ai();
		expect(plugin.id).toBe('crawl4ai');
		expect(plugin.authConfig).toEqual({ api_key: { account: ['server_url'] } });
		expect(Object.keys(plugin.endpointMeta as object)).toHaveLength(66);
		expect(Object.keys(plugin.webhooks as object)).toEqual(['jobFinished']);
	});

	it('calls the Cloud and a self-hosted server through createCorsair', async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async () =>
				Response.json({ tool: 'scrape', data: { markdown: '# Example' } }),
			);
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'crawl4ai', 'default');
		const cloud = createCorsair({
			plugins: [crawl4ai({ key: 'sk_live_test' })],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		const server = createCorsair({
			plugins: [
				crawl4ai({ key: 'server-token', serverUrl: 'http://localhost:11235' }),
			],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
		});
		await cloud.crawl4ai.api.cloud.scrape({ url: 'https://example.com' });
		await server.crawl4ai.api.server.markdown({ url: 'https://example.com' });
		// The server's token never goes to the Cloud.
		await expect(
			server.crawl4ai.api.cloud.scrape({ url: 'https://example.com' }),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		expect(fetchSpy).toHaveBeenCalledTimes(2);
		const [cloudUrl, cloudInit] = fetchSpy.mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(cloudUrl).toBe('https://api.crawl4ai.com/tools/scrape');
		expect(new Headers(cloudInit.headers).get('authorization')).toBe(
			'Bearer sk_live_test',
		);
		expect(String(fetchSpy.mock.calls[1]?.[0])).toBe(
			'http://localhost:11235/md',
		);
		await testDb.cleanup?.();
	});

	it('asks to connect without a key, and a server op without a server', async () => {
		const plugin = crawl4ai();
		const keys = {
			get_api_key: async () => null,
			get_server_url: async () => null,
			get_webhook_signature: async () => 'hook-secret',
		};
		// `never` because the test builds only the fields keyBuilder reads.
		const ctx = { keys, authType: 'api_key', options: {} } as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toMatchObject({
			name: 'AuthMissingError',
		});
		await expect(
			plugin.keyBuilder?.(
				{ keys: { ...keys, get_api_key: async () => 'k' } } as never,
				'endpoint',
			),
		).resolves.toBe('k');
		await expect(plugin.keyBuilder?.(ctx, 'webhook')).resolves.toBe(
			'hook-secret',
		);
		await expect(
			crawl4ai({ serverUrl: 'https://other.example' }).keyBuilder?.(
				{
					keys: {
						...keys,
						get_api_key: async () => 'k',
						get_server_url: async () => 'https://crawl.example.com',
					},
				} as never,
				'endpoint',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
	});
});
