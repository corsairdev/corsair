import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { MRSCRAPER_API_BASE } from './client';
import { Account, Analytics, Results, Scrape, Scrapers } from './endpoints';
import type { MrscraperContext, MrscraperPluginOptions } from './index';
import { mrscraper, mrscraperEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeMrscraperRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeMrscraperRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Account.get>[0];

function buildCtx(): Ctx {
	const ctx: MrscraperContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

const UUID = '3f2504e0-4f89-41d3-9a0c-0305e82c3301';
const URL = 'https://books.toscrape.com';

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('account.get', () => {
	it('fetches the subscription account', async () => {
		mockedRequest.mockResolvedValue({ data: { id: 'acc-1' } });

		const result = await Account.get(ctx, {});

		expect(result).toEqual({ data: { id: 'acc-1' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/subscription-accounts',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'mrscraper.account.get',
			{},
			'completed',
		);
	});

	// The input is an empty passthrough object, so there is no failing object
	// shape to call the endpoint with; reject a non-object at the schema level.
	it('rejects non-object input', () => {
		expect(
			mrscraperEndpointSchemas['account.get']?.input?.safeParse('nope').success,
		).toBe(false);
	});
});

describe('scrapers.aiInit', () => {
	it('starts an AI scraper chat', async () => {
		mockedRequest.mockResolvedValue({ data: { id: 'res-1' } });

		const result = await Scrapers.aiInit(ctx, { url: URL, prompt: 'Extract' });

		expect(result).toEqual({ data: { id: 'res-1' } });
		expect(mockedRequest).toHaveBeenCalledWith('/scrapers-ai', 'test-api-key', {
			method: 'POST',
			body: expect.objectContaining({ url: URL, prompt: 'Extract' }),
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'mrscraper.scrapers.aiInit',
			{},
			'completed',
		);
	});

	it('rejects input without a prompt', async () => {
		await expect(Scrapers.aiInit(ctx, { url: URL })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('scrapers.aiRerun', () => {
	it('re-runs an AI scraper for a URL', async () => {
		mockedRequest.mockResolvedValue({ data: { id: 'res-1' } });

		const result = await Scrapers.aiRerun(ctx, { scraperId: UUID, url: URL });

		expect(result).toEqual({ data: { id: 'res-1' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/scrapers-ai-rerun',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'mrscraper.scrapers.aiRerun',
			{ scraperId: UUID },
			'completed',
		);
	});

	it('rejects a non-positive maxPages', async () => {
		await expect(
			Scrapers.aiRerun(ctx, { scraperId: UUID, url: URL, maxPages: 0 }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('scrapers.aiRerunBulk', () => {
	it('re-runs an AI scraper across URLs', async () => {
		mockedRequest.mockResolvedValue({ data: { id: 'res-1' } });

		const result = await Scrapers.aiRerunBulk(ctx, {
			scraperId: UUID,
			urls: [URL],
		});

		expect(result).toEqual({ data: { id: 'res-1' } });
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'mrscraper.scrapers.aiRerunBulk',
			{ scraperId: UUID, urlCount: 1 },
			'completed',
		);
	});

	it('rejects an empty urls array', async () => {
		await expect(
			Scrapers.aiRerunBulk(ctx, { scraperId: UUID, urls: [] }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('scrapers.manualRerun', () => {
	it('re-runs a manual scraper for a URL', async () => {
		mockedRequest.mockResolvedValue({ data: { id: 'res-1' } });

		const result = await Scrapers.manualRerun(ctx, {
			scraperId: UUID,
			url: URL,
		});

		expect(result).toEqual({ data: { id: 'res-1' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/scrapers-manual-rerun',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('rejects a malformed url', async () => {
		await expect(
			Scrapers.manualRerun(ctx, { scraperId: UUID, url: 'not a url' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('scrapers.manualRerunBulk', () => {
	it('re-runs a manual scraper across URLs', async () => {
		mockedRequest.mockResolvedValue({ data: { id: 'res-1' } });

		const result = await Scrapers.manualRerunBulk(ctx, {
			scraperId: UUID,
			urls: [URL, URL],
		});

		expect(result).toEqual({ data: { id: 'res-1' } });
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'mrscraper.scrapers.manualRerunBulk',
			{ scraperId: UUID, urlCount: 2 },
			'completed',
		);
	});

	it('rejects an empty urls array', async () => {
		await expect(
			Scrapers.manualRerunBulk(ctx, { scraperId: UUID, urls: [] }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('scrapers.manualHeal', () => {
	it('heals a manual scraper workflow', async () => {
		mockedRequest.mockResolvedValue({ data: { success: true } });

		const result = await Scrapers.manualHeal(ctx, { scraperId: UUID });

		expect(result).toEqual({ data: { success: true } });
		expect(mockedRequest).toHaveBeenCalledWith(
			`/scrapers-manual/${UUID}/heal`,
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('rejects a non-uuid scraperId', async () => {
		await expect(
			Scrapers.manualHeal(ctx, { scraperId: 'not-a-uuid' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('scrapers.cancelBulkByScraper', () => {
	it('cancels a queued bulk run for a scraper', async () => {
		mockedRequest.mockResolvedValue({
			data: { id: 'res-1', canceledUrls: [] },
		});

		const result = await Scrapers.cancelBulkByScraper(ctx, {
			scraperId: UUID,
		});

		expect(result).toEqual({ data: { id: 'res-1', canceledUrls: [] } });
		expect(mockedRequest).toHaveBeenCalledWith(
			`/scrapers-bulks/${UUID}/cancel`,
			'test-api-key',
			{ method: 'PATCH' },
		);
	});

	it('rejects a non-uuid scraperId', async () => {
		await expect(
			Scrapers.cancelBulkByScraper(ctx, { scraperId: 'nope' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('scrapers.cancelBulkByResult', () => {
	it('cancels a queued bulk run by result id', async () => {
		mockedRequest.mockResolvedValue({ data: { id: 'res-1', bulkUrls: [URL] } });

		const result = await Scrapers.cancelBulkByResult(ctx, {
			resultId: 'res-1',
		});

		expect(result).toEqual({ data: { id: 'res-1', bulkUrls: [URL] } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/scrapers-bulks/result/res-1/cancel',
			'test-api-key',
			{ method: 'PATCH' },
		);
	});

	it('rejects an empty resultId', async () => {
		await expect(
			Scrapers.cancelBulkByResult(ctx, { resultId: '' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('results.list', () => {
	it('lists results with pagination and filters', async () => {
		mockedRequest.mockResolvedValue({
			data: [{ id: 'res-1' }],
			meta: { page: 1 },
		});

		const result = await Results.list(ctx, {
			page: 1,
			pageSize: 20,
			filters: { scraperId: 'sp-1' },
		});

		expect(result).toEqual({ data: [{ id: 'res-1' }], meta: { page: 1 } });
		expect(mockedRequest).toHaveBeenCalledWith('/results', 'test-api-key', {
			method: 'GET',
			query: expect.objectContaining({
				page: 1,
				pageSize: 20,
				filters: { scraperId: 'sp-1' },
			}),
		});
	});

	it('rejects a non-positive page', async () => {
		await expect(Results.list(ctx, { page: 0 })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('results.get', () => {
	it('fetches a single result by id', async () => {
		mockedRequest.mockResolvedValue({ data: [{ id: 'res-1' }] });

		const result = await Results.get(ctx, { id: 'res-1' });

		expect(result).toEqual({ data: [{ id: 'res-1' }] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/results/res-1',
			'test-api-key',
			{
				method: 'GET',
			},
		);
	});

	it('rejects an empty id', async () => {
		await expect(Results.get(ctx, { id: '' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('analytics.statuses', () => {
	it('fetches per-domain status analytics', async () => {
		mockedRequest.mockResolvedValue({
			data: { data: [{ key: 'COMPLETED', value: '35' }] },
		});

		const result = await Analytics.statuses(ctx, {
			domain: 'books.toscrape.com',
			startDate: '2026-01-01 00:00:00',
			endDate: '2026-01-31 23:59:59',
		});

		expect(result).toEqual({
			data: { data: [{ key: 'COMPLETED', value: '35' }] },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/analytic/statuses',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('rejects an empty startDate', async () => {
		await expect(
			Analytics.statuses(ctx, {
				domain: 'books.toscrape.com',
				startDate: '',
				endDate: '',
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('analytics.proxyBandwidth', () => {
	it('fetches proxy bandwidth usage', async () => {
		mockedRequest.mockResolvedValue([{ username: 'u1' }]);

		const result = await Analytics.proxyBandwidth(ctx, {
			startDate: '2026-01-01',
			endDate: '2026-01-31',
		});

		expect(result).toEqual([{ username: 'u1' }]);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/proxies/user/requests-bandwidth',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('rejects a missing endDate', async () => {
		await expect(
			Analytics.proxyBandwidth(ctx, {
				startDate: '2026-01-01',
				endDate: '',
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('scrape.fetch', () => {
	it('fetches rendered HTML from the Scraper API', async () => {
		mockedRequest.mockResolvedValue('<html></html>');

		const result = await Scrape.fetch(ctx, { url: URL });

		expect(result).toBe('<html></html>');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/',
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				base: MRSCRAPER_API_BASE,
				includeTokenQuery: true,
				headers: { Accept: 'text/html' },
				query: expect.objectContaining({ url: URL, html: true }),
			}),
		);
	});

	it('rejects a malformed url', async () => {
		await expect(Scrape.fetch(ctx, { url: 'nope' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('scrape.markdown', () => {
	it('scrapes a page as Markdown', async () => {
		mockedRequest.mockResolvedValue({ code: 200, markdown: '# Title' });

		const result = await Scrape.markdown(ctx, { url: URL });

		expect(result).toEqual({ code: 200, markdown: '# Title' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				base: MRSCRAPER_API_BASE,
				includeTokenQuery: true,
				body: expect.objectContaining({ url: URL }),
				query: expect.objectContaining({ markdown: true }),
			}),
		);
	});

	it('rejects a malformed url', async () => {
		await expect(Scrape.markdown(ctx, { url: 'nope' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('scrape.json', () => {
	it('extracts structured JSON with the general agent', async () => {
		mockedRequest.mockResolvedValue({ code: 200, data: { title: 'Hello' } });

		const result = await Scrape.json(ctx, { url: URL, prompt: 'Extract' });

		expect(result).toEqual({ code: 200, data: { title: 'Hello' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({ url: URL, agent: 'general' }),
			}),
		);
	});

	it('rejects a malformed url', async () => {
		await expect(Scrape.json(ctx, { url: 'nope' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('scrape.screenshot', () => {
	it('captures a screenshot', async () => {
		mockedRequest.mockResolvedValue({ code: 200, screenshot: 's3://x.png' });

		const result = await Scrape.screenshot(ctx, { url: URL });

		expect(result).toEqual({ code: 200, screenshot: 's3://x.png' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				query: expect.objectContaining({ screenshot: 'full' }),
			}),
		);
	});

	it('rejects a malformed url', async () => {
		await expect(Scrape.screenshot(ctx, { url: 'nope' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('scrape.listing', () => {
	it('scrapes paginated listing pages', async () => {
		mockedRequest.mockResolvedValue({ code: 200, data: { '0': {} } });

		const result = await Scrape.listing(ctx, { url: URL, maxPages: 3 });

		expect(result).toEqual({ code: 200, data: { '0': {} } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({ url: URL, agent: 'listing' }),
				query: expect.objectContaining({ super: true }),
			}),
		);
	});

	it('rejects a malformed url', async () => {
		await expect(Scrape.listing(ctx, { url: 'nope' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('scrape.sitemap', () => {
	it('maps a site sitemap', async () => {
		mockedRequest.mockResolvedValue({ code: 200, data: { urls: [URL] } });

		const result = await Scrape.sitemap(ctx, { url: URL, maxDepth: 2 });

		expect(result).toEqual({ code: 200, data: { urls: [URL] } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({ url: URL, agent: 'map' }),
			}),
		);
	});

	it('rejects a malformed url', async () => {
		await expect(Scrape.sitemap(ctx, { url: 'nope' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('mrscraper plugin shape', () => {
	it('exposes every grouped endpoint', () => {
		const plugin = mrscraper({});

		expect(plugin.endpoints?.account.get).toBeDefined();
		expect(plugin.endpoints?.scrapers.aiInit).toBeDefined();
		expect(plugin.endpoints?.scrapers.aiRerun).toBeDefined();
		expect(plugin.endpoints?.scrapers.aiRerunBulk).toBeDefined();
		expect(plugin.endpoints?.scrapers.manualRerun).toBeDefined();
		expect(plugin.endpoints?.scrapers.manualRerunBulk).toBeDefined();
		expect(plugin.endpoints?.scrapers.manualHeal).toBeDefined();
		expect(plugin.endpoints?.scrapers.cancelBulkByScraper).toBeDefined();
		expect(plugin.endpoints?.scrapers.cancelBulkByResult).toBeDefined();
		expect(plugin.endpoints?.results.list).toBeDefined();
		expect(plugin.endpoints?.results.get).toBeDefined();
		expect(plugin.endpoints?.analytics.statuses).toBeDefined();
		expect(plugin.endpoints?.analytics.proxyBandwidth).toBeDefined();
		expect(plugin.endpoints?.scrape.fetch).toBeDefined();
		expect(plugin.endpoints?.scrape.markdown).toBeDefined();
		expect(plugin.endpoints?.scrape.json).toBeDefined();
		expect(plugin.endpoints?.scrape.screenshot).toBeDefined();
		expect(plugin.endpoints?.scrape.listing).toBeDefined();
		expect(plugin.endpoints?.scrape.sitemap).toBeDefined();
	});

	it('uses api_key auth and declares no webhooks', () => {
		const plugin = mrscraper({ authType: 'api_key' });

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('wires zod input and output schemas for every endpoint', () => {
		for (const entry of Object.values(mrscraperEndpointSchemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
		expect(Object.keys(mrscraperEndpointSchemas)).toHaveLength(19);
	});
});

describe('mrscraper custom error handlers', () => {
	it('orders caller-provided handlers before the catch-all DEFAULT', () => {
		const plugin = mrscraper<MrscraperPluginOptions>({
			authType: 'api_key',
			errorHandlers: {
				CUSTOM_ERROR: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});

		const merged = plugin.errorHandlers ?? {};
		const names = Object.keys(merged);
		expect(names).toContain('CUSTOM_ERROR');
		// Core selects the first matching handler, and DEFAULT matches
		// everything, so a custom handler is only reachable when DEFAULT is
		// evaluated last.
		expect(names[names.length - 1]).toBe('DEFAULT');
	});

	it('keeps a caller-supplied DEFAULT last even when it is declared first', () => {
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};
		const plugin = mrscraper<MrscraperPluginOptions>({
			authType: 'api_key',
			errorHandlers: {
				// Declared first on purpose: spreading this object as-is would
				// insert DEFAULT ahead of CUSTOM_ERROR and shadow it.
				DEFAULT: callerDefault,
				CUSTOM_ERROR: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});

		const merged = plugin.errorHandlers ?? {};
		const names = Object.keys(merged);
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(names.indexOf('CUSTOM_ERROR')).toBeLessThan(
			names.indexOf('DEFAULT'),
		);
		expect(plugin.errorHandlers?.DEFAULT).toBe(callerDefault);
	});
});
