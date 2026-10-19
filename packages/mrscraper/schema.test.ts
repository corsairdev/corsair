import {
	AccountGetInputSchema,
	AccountGetResponseSchema,
	AnalyticsProxyBandwidthInputSchema,
	AnalyticsProxyBandwidthResponseSchema,
	AnalyticsStatusesInputSchema,
	AnalyticsStatusesResponseSchema,
	ResultsGetInputSchema,
	ResultsGetResponseSchema,
	ResultsListInputSchema,
	ResultsListResponseSchema,
	ScrapeFetchInputSchema,
	ScrapeFetchResponseSchema,
	ScrapeJsonInputSchema,
	ScrapeJsonResponseSchema,
	ScrapeListingInputSchema,
	ScrapeListingResponseSchema,
	ScrapeMarkdownInputSchema,
	ScrapeMarkdownResponseSchema,
	ScrapersAiInitInputSchema,
	ScrapersAiInitResponseSchema,
	ScrapersAiRerunBulkInputSchema,
	ScrapersAiRerunBulkResponseSchema,
	ScrapersAiRerunInputSchema,
	ScrapersAiRerunResponseSchema,
	ScrapersCancelBulkByResultInputSchema,
	ScrapersCancelBulkByResultResponseSchema,
	ScrapersCancelBulkByScraperInputSchema,
	ScrapersCancelBulkByScraperResponseSchema,
	ScrapersManualHealInputSchema,
	ScrapersManualHealResponseSchema,
	ScrapersManualRerunBulkInputSchema,
	ScrapersManualRerunBulkResponseSchema,
	ScrapersManualRerunInputSchema,
	ScrapersManualRerunResponseSchema,
	ScrapeScreenshotInputSchema,
	ScrapeScreenshotResponseSchema,
	ScrapeSitemapInputSchema,
	ScrapeSitemapResponseSchema,
} from './endpoints/types';
import { MrscraperSchema } from './schema';
import { mrscraperEntities } from './schema/database';

// Minimal structural type so schemas can be exercised without importing zod.
type Parseable = { safeParse: (value: unknown) => { success: boolean } };

function expectValid(schema: Parseable, value: unknown) {
	expect(schema.safeParse(value).success).toBe(true);
}

function expectInvalid(schema: Parseable, value: unknown) {
	expect(schema.safeParse(value).success).toBe(false);
}

const UUID = '3f2504e0-4f89-41d3-9a0c-0305e82c3301';
const URL = 'https://books.toscrape.com';

describe('Mrscraper schema', () => {
	it('declares a semver version', () => {
		expect(MrscraperSchema.version).toBeDefined();
		expect(MrscraperSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(MrscraperSchema.entities).toBe(mrscraperEntities);
		expect(MrscraperSchema.entities).toEqual({});
	});
});

describe('account schemas', () => {
	it('validates account get input', () => {
		expectValid(AccountGetInputSchema, {});
		expectInvalid(AccountGetInputSchema, 'nope');
	});

	it('validates account get output', () => {
		expectValid(AccountGetResponseSchema, {
			message: 'Successful operation!',
			data: {
				id: 'acc-1',
				tokenLimit: 100000,
				tokenUsage: 1234,
				isEnterprise: false,
				user: { id: 'u1', email: 'a@b.com', isVerified: true },
			},
		});
		expectInvalid(AccountGetResponseSchema, { message: 'ok' });
	});
});

describe('scrapers ai schemas', () => {
	it('validates aiInit input (prompt or message required)', () => {
		expectValid(ScrapersAiInitInputSchema, { url: URL, prompt: 'Extract' });
		expectValid(ScrapersAiInitInputSchema, { url: URL, message: 'Extract' });
		expectInvalid(ScrapersAiInitInputSchema, { url: URL });
		expectInvalid(ScrapersAiInitInputSchema, { prompt: 'Extract' });
	});

	it('validates aiInit output', () => {
		expectValid(ScrapersAiInitResponseSchema, {
			data: { id: 'res-1', runtime: '8.678' },
		});
		expectInvalid(ScrapersAiInitResponseSchema, { data: {} });
	});

	it('validates aiRerun input', () => {
		expectValid(ScrapersAiRerunInputSchema, {
			scraperId: UUID,
			url: URL,
			includePatterns: ['/products/*'],
		});
		expectValid(ScrapersAiRerunInputSchema, {
			scraperId: UUID,
			url: URL,
			includePatterns: '/products/*',
		});
		expectInvalid(ScrapersAiRerunInputSchema, { url: URL });
		expectInvalid(ScrapersAiRerunInputSchema, {
			scraperId: 'not-a-uuid',
			url: URL,
		});
	});

	it('validates aiRerun output', () => {
		expectValid(ScrapersAiRerunResponseSchema, {
			data: { id: 'res-1', type: 'Rerun-AI', runtime: 3.2 },
		});
		expectInvalid(ScrapersAiRerunResponseSchema, {});
	});

	it('validates aiRerunBulk input and output', () => {
		expectValid(ScrapersAiRerunBulkInputSchema, {
			scraperId: UUID,
			urls: [URL],
		});
		expectInvalid(ScrapersAiRerunBulkInputSchema, {
			scraperId: UUID,
			urls: [],
		});

		expectValid(ScrapersAiRerunBulkResponseSchema, {
			data: {
				id: 'res-1',
				type: 'Bulk-AI',
				data: {
					urlDetails: [{ url: URL, status: 'COMPLETED' }],
					summary: { totalUrls: 1, successfulUrls: 1 },
				},
			},
		});
		expectInvalid(ScrapersAiRerunBulkResponseSchema, {
			data: { data: { summary: { totalUrls: 1 } } },
		});
	});
});

describe('scrapers manual schemas', () => {
	it('validates manualRerun input and output', () => {
		expectValid(ScrapersManualRerunInputSchema, {
			scraperId: UUID,
			url: URL,
			record: false,
			paginator: { type: 'click', max_page: 3, enabled: true },
		});
		expectInvalid(ScrapersManualRerunInputSchema, { scraperId: UUID });

		expectValid(ScrapersManualRerunResponseSchema, {
			data: { id: 'res-1', type: 'Rerun-Manual' },
		});
		expectInvalid(ScrapersManualRerunResponseSchema, { data: {} });
	});

	it('validates manualRerunBulk input and output', () => {
		expectValid(ScrapersManualRerunBulkInputSchema, {
			scraperId: UUID,
			urls: [URL, URL],
		});
		expectInvalid(ScrapersManualRerunBulkInputSchema, {
			scraperId: UUID,
			urls: 'nope',
		});

		expectValid(ScrapersManualRerunBulkResponseSchema, {
			data: { id: 'res-1', data: { urlDetails: [] } },
		});
		expectInvalid(ScrapersManualRerunBulkResponseSchema, {});
	});

	it('validates manualHeal input and output', () => {
		expectValid(ScrapersManualHealInputSchema, { scraperId: UUID });
		expectInvalid(ScrapersManualHealInputSchema, {});

		expectValid(ScrapersManualHealResponseSchema, {
			data: { success: true, scraperId: UUID, workflowUpdated: true },
		});
		expectInvalid(ScrapersManualHealResponseSchema, { data: {} });
	});

	it('validates bulk cancel inputs and outputs', () => {
		expectValid(ScrapersCancelBulkByScraperInputSchema, { scraperId: UUID });
		expectInvalid(ScrapersCancelBulkByScraperInputSchema, {
			scraperId: 'not-a-uuid',
		});

		expectValid(ScrapersCancelBulkByResultInputSchema, {
			resultId: 'res-1',
		});
		expectInvalid(ScrapersCancelBulkByResultInputSchema, { resultId: '' });

		expectValid(ScrapersCancelBulkByScraperResponseSchema, {
			data: { id: 'res-1', canceledUrls: [URL] },
		});
		expectInvalid(ScrapersCancelBulkByScraperResponseSchema, { data: {} });

		expectValid(ScrapersCancelBulkByResultResponseSchema, {
			data: { id: 'res-1', bulkUrls: [URL] },
		});
		expectInvalid(ScrapersCancelBulkByResultResponseSchema, {});
	});
});

describe('results schemas', () => {
	it('validates results list input', () => {
		expectValid(ResultsListInputSchema, {
			page: 1,
			pageSize: 20,
			sortOrder: 'DESC',
			filters: { scraperId: 'sp-1' },
		});
		expectInvalid(ResultsListInputSchema, { page: 'first' });
		expectInvalid(ResultsListInputSchema, { sortOrder: 'UP' });
	});

	it('validates results list output', () => {
		expectValid(ResultsListResponseSchema, {
			message: 'Successful fetch',
			data: [{ id: 'res-1', url: URL, status: 'COMPLETED' }],
			meta: { page: 1, pageSize: 20, total: 1, totalPage: 1 },
		});
		expectInvalid(ResultsListResponseSchema, { data: {} });
	});

	it('validates results get input and output', () => {
		expectValid(ResultsGetInputSchema, { id: 'res-1' });
		expectInvalid(ResultsGetInputSchema, { id: '' });

		expectValid(ResultsGetResponseSchema, { data: [{ id: 'res-1' }] });
		expectInvalid(ResultsGetResponseSchema, { data: { id: 'res-1' } });
	});
});

describe('analytics schemas', () => {
	it('validates statuses input and output', () => {
		expectValid(AnalyticsStatusesInputSchema, {
			domain: 'books.toscrape.com',
			startDate: '2026-01-01 00:00:00',
			endDate: '2026-01-31 23:59:59',
			action: 'scrape',
		});
		expectInvalid(AnalyticsStatusesInputSchema, {
			domain: 'books.toscrape.com',
		});

		expectValid(AnalyticsStatusesResponseSchema, {
			data: {
				countAll: 100,
				successRate: '99',
				data: [{ key: 'COMPLETED', value: '35' }],
			},
		});
		expectInvalid(AnalyticsStatusesResponseSchema, {
			data: { data: [{}] },
		});
	});

	it('validates proxy bandwidth input and output', () => {
		expectValid(AnalyticsProxyBandwidthInputSchema, {
			startDate: '2026-01-01',
			endDate: '2026-01-31',
			timezone: 'UTC',
		});
		expectInvalid(AnalyticsProxyBandwidthInputSchema, {
			startDate: '2026-01-01',
		});

		expectValid(AnalyticsProxyBandwidthResponseSchema, [
			{ username: 'u1', total_bandwidth_usage: 12345 },
		]);
		expectInvalid(AnalyticsProxyBandwidthResponseSchema, {
			username: 'u1',
		});
	});
});

describe('scraper api schemas', () => {
	it('validates scrape fetch input and output', () => {
		expectValid(ScrapeFetchInputSchema, { url: URL, html: true });
		expectInvalid(ScrapeFetchInputSchema, { url: 'not a url' });

		expectValid(ScrapeFetchResponseSchema, '<html></html>');
		expectInvalid(ScrapeFetchResponseSchema, 42);
	});

	it('validates scrape markdown input and output', () => {
		expectValid(ScrapeMarkdownInputSchema, { url: URL, timeout: 300 });
		expectInvalid(ScrapeMarkdownInputSchema, {});

		expectValid(ScrapeMarkdownResponseSchema, {
			code: 200,
			markdown: '# Title',
			runtime: 1.5,
		});
		expectInvalid(ScrapeMarkdownResponseSchema, {});
	});

	it('validates scrape json input and output', () => {
		expectValid(ScrapeJsonInputSchema, {
			url: URL,
			prompt: 'Extract all data',
			agent: 'general',
		});
		expectInvalid(ScrapeJsonInputSchema, { url: 'nope' });

		expectValid(ScrapeJsonResponseSchema, {
			code: 200,
			data: { title: 'Hello' },
			extractions: '{}',
		});
		expectInvalid(ScrapeJsonResponseSchema, { code: 'ok' });
	});

	it('validates scrape screenshot input and output', () => {
		expectValid(ScrapeScreenshotInputSchema, {
			url: URL,
			screenshot: 'full',
		});
		expectInvalid(ScrapeScreenshotInputSchema, {});

		expectValid(ScrapeScreenshotResponseSchema, {
			code: 200,
			screenshot: 'https://cdn.mrscraper.com/x.png',
		});
		expectInvalid(ScrapeScreenshotResponseSchema, {});
	});

	it('validates scrape listing input and output', () => {
		expectValid(ScrapeListingInputSchema, { url: URL, maxPages: 3 });
		expectInvalid(ScrapeListingInputSchema, {});

		expectValid(ScrapeListingResponseSchema, {
			code: 200,
			data: { '0': { page_num: 1 } },
		});
		expectInvalid(ScrapeListingResponseSchema, {});
	});

	it('validates scrape sitemap input and output', () => {
		expectValid(ScrapeSitemapInputSchema, {
			url: URL,
			maxDepth: 2,
			includePatterns: ['/blog/*'],
		});
		expectInvalid(ScrapeSitemapInputSchema, {
			url: URL,
			includePatterns: '/blog/*',
		});

		expectValid(ScrapeSitemapResponseSchema, {
			code: 200,
			data: { count: 2, urls: [URL] },
		});
		expectInvalid(ScrapeSitemapResponseSchema, {});
	});
});
