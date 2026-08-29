import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	AccountEndpoints,
	ScraperEndpoints,
	SerpEndpoints,
	WebUnlockerEndpoints,
} from './endpoints';
import {
	BrightDataEndpointInputSchemas,
	BrightDataEndpointOutputSchemas,
} from './endpoints/types';
import { brightdata, type BrightDataContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

function makeCtx(key = 'test-brightdata-key'): BrightDataContext {
	return {
		key,
		db: {},
	} as unknown as BrightDataContext;
}

describe('Bright Data Plugin', () => {
	let lastUrl = '';
	let lastMethod = '';
	let lastHeaders: Record<string, string> = {};
	let lastBody: unknown;

	beforeEach(() => {
		mockLogEvent.mockClear();
		lastUrl = '';
		lastMethod = '';
		lastHeaders = {};
		lastBody = undefined;

		global.fetch = (async (url: unknown, init?: RequestInit) => {
			lastUrl = String(url);
			lastMethod = init?.method ?? 'GET';
			const headers: Record<string, string> = {};
			if (init?.headers) {
				const h = init.headers;
				if (h instanceof Headers) {
					h.forEach((v, k) => {
						headers[k.toLowerCase()] = v;
					});
				} else {
					for (const [k, v] of Object.entries(
						h as Record<string, string>,
					)) {
						headers[k.toLowerCase()] = v;
					}
				}
			}
			lastHeaders = headers;
			if (init?.body) {
				try {
					lastBody = JSON.parse(init.body as string);
				} catch {
					lastBody = init.body;
				}
			}

			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url: String(url),
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => ({
					status: 200,
					body: '<html>mock</html>',
					response_id: 'res_123',
					snapshot_id: 's_123',
					balance: 50.0,
					currency: 'USD',
					zones: [{ name: 'unblocker', type: 'unlocker' }],
					datasets: [{ id: 'gd_123', name: 'Products' }],
					general: { search_engine: 'google' },
					organic: [{ link: 'https://example.com', title: 'Example' }],
				}),
				text: async () => JSON.stringify({ status: 200 }),
			};
		}) as unknown as typeof global.fetch;
	});

	describe('Plugin configuration', () => {
		it('initializes with default options', () => {
			const plugin = brightdata();
			expect(plugin.id).toBe('brightdata');
			expect(plugin.authConfig).toBeDefined();
			expect(plugin.endpoints?.webUnlocker?.unlock).toBeDefined();
			expect(plugin.endpoints?.serp?.search).toBeDefined();
			expect(plugin.endpoints?.scraper?.trigger).toBeDefined();
			expect(plugin.endpoints?.account?.getBalance).toBeDefined();
		});

		it('keyBuilder returns explicit key when provided', async () => {
			const plugin = brightdata({ key: 'explicit-key' });
			const keyBuilder = plugin.keyBuilder as any;
			const key = await keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored-key' },
				},
				'endpoint',
			);
			expect(key).toBe('explicit-key');
		});

		it('keyBuilder retrieves key from context keys', async () => {
			const plugin = brightdata();
			const keyBuilder = plugin.keyBuilder as any;
			const key = await keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored-key' },
				},
				'endpoint',
			);
			expect(key).toBe('stored-key');
		});

		it('keyBuilder throws AuthMissingError when no key is found', async () => {
			const plugin = brightdata();
			const keyBuilder = plugin.keyBuilder as any;
			await expect(
				keyBuilder(
					{
						authType: 'api_key',
						keys: { get_api_key: async () => undefined },
					},
					'endpoint',
				),
			).rejects.toThrow(AuthMissingError);
		});
	});

	describe('Web Unlocker Endpoints', () => {
		it('webUnlocker.unlock sends POST to /request and logs event', async () => {
			const ctx = makeCtx();
			const input = {
				zone: 'unblocker',
				url: 'https://example.com/target',
				format: 'raw' as const,
			};

			BrightDataEndpointInputSchemas['webUnlocker.unlock'].parse(input);
			const result = await WebUnlockerEndpoints.unlock(ctx, input);

			expect(lastUrl).toContain('/request');
			expect(lastMethod).toBe('POST');
			expect(lastHeaders.authorization).toBe('Bearer test-brightdata-key');
			expect(lastBody).toEqual(input);
			expect(mockLogEvent).toHaveBeenCalledWith(
				ctx,
				'brightdata.webUnlocker.unlock',
				expect.objectContaining({ zone: 'unblocker' }),
				'completed',
			);
			BrightDataEndpointOutputSchemas['webUnlocker.unlock'].parse(result);
		});

		it('webUnlocker.unlockAsync sends POST to /unblocker/req', async () => {
			const ctx = makeCtx();
			const input = {
				zone: 'unblocker',
				url: 'https://example.com/target',
			};

			const result = await WebUnlockerEndpoints.unlockAsync(ctx, input);
			expect(lastUrl).toContain('/unblocker/req');
			expect(lastMethod).toBe('POST');
			BrightDataEndpointOutputSchemas['webUnlocker.unlockAsync'].parse(result);
		});

		it('webUnlocker.getAsyncResult sends GET to /unblocker/get_result', async () => {
			const ctx = makeCtx();
			const result = await WebUnlockerEndpoints.getAsyncResult(ctx, {
				id: 'res_123',
			});

			expect(lastUrl).toContain('/unblocker/get_result');
			expect(lastUrl).toContain('id=res_123');
			expect(lastMethod).toBe('GET');
			BrightDataEndpointOutputSchemas['webUnlocker.getAsyncResult'].parse(result);
		});
	});

	describe('SERP Endpoints', () => {
		it('serp.search sends POST /request with formatted body', async () => {
			const ctx = makeCtx();
			const input = {
				zone: 'serp_zone',
				url: 'https://www.google.com/search?q=corsair',
			};

			const result = await SerpEndpoints.search(ctx, input);
			expect(lastUrl).toContain('/request');
			expect(lastMethod).toBe('POST');
			BrightDataEndpointOutputSchemas['serp.search'].parse(result);
		});

		it('serp.query builds engine URL correctly for google', async () => {
			const ctx = makeCtx();
			const input = {
				zone: 'serp_zone',
				query: 'test search',
				engine: 'google' as const,
				country: 'us',
				language: 'en',
			};

			const result = await SerpEndpoints.query(ctx, input);
			expect(lastUrl).toContain('/request');
			expect(lastMethod).toBe('POST');
			expect(lastBody).toEqual(
				expect.objectContaining({
					zone: 'serp_zone',
					url: expect.stringContaining('google.com/search?q=test+search'),
					search_engine: 'google',
				}),
			);
			BrightDataEndpointOutputSchemas['serp.query'].parse(result);
		});

		it('serp.query builds engine URL correctly for bing', async () => {
			const ctx = makeCtx();
			const input = {
				zone: 'serp_zone',
				query: 'bing query',
				engine: 'bing' as const,
			};

			const result = await SerpEndpoints.query(ctx, input);
			expect(lastBody).toEqual(
				expect.objectContaining({
					url: expect.stringContaining('bing.com/search?q=bing+query'),
				}),
			);
			BrightDataEndpointOutputSchemas['serp.query'].parse(result);
		});
	});

	describe('Scraper / Datasets Endpoints', () => {
		it('scraper.trigger sends POST to /datasets/v3/trigger', async () => {
			const ctx = makeCtx();
			const input = {
				dataset_id: 'gd_12345',
				inputs: [{ url: 'https://example.com' }],
			};

			const result = await ScraperEndpoints.trigger(ctx, input);
			expect(lastUrl).toContain('/datasets/v3/trigger');
			expect(lastUrl).toContain('dataset_id=gd_12345');
			expect(lastMethod).toBe('POST');
			expect(lastBody).toEqual(input.inputs);
			BrightDataEndpointOutputSchemas['scraper.trigger'].parse(result);
		});

		it('scraper.getProgress sends GET to /datasets/v3/progress/{snapshot_id}', async () => {
			const ctx = makeCtx();
			const result = await ScraperEndpoints.getProgress(ctx, {
				snapshot_id: 's_123',
			});

			expect(lastUrl).toContain('/datasets/v3/progress/s_123');
			expect(lastMethod).toBe('GET');
			BrightDataEndpointOutputSchemas['scraper.getProgress'].parse(result);
		});

		it('scraper.getSnapshot sends GET to /datasets/v3/snapshot/{snapshot_id}', async () => {
			const ctx = makeCtx();
			const result = await ScraperEndpoints.getSnapshot(ctx, {
				snapshot_id: 's_123',
			});

			expect(lastUrl).toContain('/datasets/v3/snapshot/s_123');
			expect(lastMethod).toBe('GET');
			BrightDataEndpointOutputSchemas['scraper.getSnapshot'].parse(result);
		});

		it('scraper.getSnapshotMetadata sends GET to /datasets/snapshots/{snapshot_id}', async () => {
			const ctx = makeCtx();
			const result = await ScraperEndpoints.getSnapshotMetadata(ctx, {
				snapshot_id: 's_123',
			});

			expect(lastUrl).toContain('/datasets/snapshots/s_123');
			expect(lastMethod).toBe('GET');
			BrightDataEndpointOutputSchemas['scraper.getSnapshotMetadata'].parse(result);
		});

		it('scraper.deliverSnapshot sends POST to /datasets/snapshots/{snapshot_id}/deliver', async () => {
			const ctx = makeCtx();
			const result = await ScraperEndpoints.deliverSnapshot(ctx, {
				snapshot_id: 's_123',
				deliver: { target: 'webhook', url: 'https://my-webhook.com' },
			});

			expect(lastUrl).toContain('/datasets/snapshots/s_123/deliver');
			expect(lastMethod).toBe('POST');
			BrightDataEndpointOutputSchemas['scraper.deliverSnapshot'].parse(result);
		});

		it('scraper.listDatasets sends GET to /datasets/v3/datasets', async () => {
			const ctx = makeCtx();
			const result = await ScraperEndpoints.listDatasets(ctx, {
				limit: 10,
			});

			expect(lastUrl).toContain('/datasets/v3/datasets');
			expect(lastUrl).toContain('limit=10');
			expect(lastMethod).toBe('GET');
			BrightDataEndpointOutputSchemas['scraper.listDatasets'].parse(result);
		});
	});

	describe('Account Endpoints', () => {
		it('account.getBalance sends GET to /customer/balance', async () => {
			const ctx = makeCtx();
			const result = await AccountEndpoints.getBalance(ctx, {});

			expect(lastUrl).toContain('/customer/balance');
			expect(lastMethod).toBe('GET');
			BrightDataEndpointOutputSchemas['account.getBalance'].parse(result);
		});

		it('account.listZones sends GET to /zone', async () => {
			const ctx = makeCtx();
			const result = await AccountEndpoints.listZones(ctx, {});

			expect(lastUrl).toContain('/zone');
			expect(lastMethod).toBe('GET');
			BrightDataEndpointOutputSchemas['account.listZones'].parse(result);
		});
	});
});
