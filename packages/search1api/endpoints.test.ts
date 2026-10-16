import type { z } from 'zod';
import {
	Search1APIEndpointInputSchemas,
	Search1APIEndpointOutputSchemas,
} from './endpoints/types';

const inputs = Search1APIEndpointInputSchemas;
const outputs = Search1APIEndpointOutputSchemas;

type AnySchema = z.ZodTypeAny;

function accepts(schema: AnySchema, value: unknown): boolean {
	return schema.safeParse(value).success;
}

describe('web.search input', () => {
	it('accepts the documented fields', () => {
		expect(
			accepts(inputs.search, {
				query: 'latest ai papers',
				search_service: 'arxiv',
				max_results: 20,
				page: 2,
				crawl_results: 3,
				image: true,
				include_sites: ['arxiv.org'],
				exclude_sites: ['reddit.com'],
				language: 'en',
				time_range: 'month',
			}),
		).toBe(true);
	});

	it('accepts the empty-string sentinels the API documents', () => {
		expect(
			accepts(inputs.search, {
				query: 'x',
				search_service: '',
				time_range: '',
			}),
		).toBe(true);
	});

	it('requires a non-empty query', () => {
		expect(accepts(inputs.search, {})).toBe(false);
		expect(accepts(inputs.search, { query: '' })).toBe(false);
	});

	it('rejects unknown keys instead of silently dropping them', () => {
		expect(accepts(inputs.search, { query: 'x', oiseau: true })).toBe(false);
	});

	it('enforces the documented ranges', () => {
		expect(accepts(inputs.search, { query: 'x', max_results: 50 })).toBe(true);
		expect(accepts(inputs.search, { query: 'x', max_results: 51 })).toBe(false);
		expect(accepts(inputs.search, { query: 'x', max_results: 0 })).toBe(false);
		expect(accepts(inputs.search, { query: 'x', page: 0 })).toBe(false);
		expect(accepts(inputs.search, { query: 'x', crawl_results: -1 })).toBe(
			false,
		);
		expect(accepts(inputs.search, { query: 'x', crawl_results: 50 })).toBe(
			true,
		);
	});

	it('rejects engines and windows outside the documented enums', () => {
		expect(
			accepts(inputs.search, { query: 'x', search_service: 'brave' }),
		).toBe(false);
		expect(accepts(inputs.search, { query: 'x', time_range: 'hour' })).toBe(
			false,
		);
	});
});

describe('web.searchBatch input', () => {
	it('accepts an array of searches', () => {
		expect(accepts(inputs.searchBatch, [{ query: 'a' }, { query: 'b' }])).toBe(
			true,
		);
	});

	it('rejects an empty or malformed batch', () => {
		expect(accepts(inputs.searchBatch, [])).toBe(false);
		expect(accepts(inputs.searchBatch, [{}])).toBe(false);
		expect(accepts(inputs.searchBatch, { query: 'a' })).toBe(false);
	});
});

describe('web.news input', () => {
	it('accepts the documented news fields', () => {
		expect(
			accepts(inputs.news, {
				query: 'climate policy',
				search_service: 'reuters',
				max_results: 10,
				crawl_results: 2,
				time_range: 'day',
			}),
		).toBe(true);
	});

	it('rejects engines outside the news enum', () => {
		expect(accepts(inputs.news, { query: 'x', search_service: 'arxiv' })).toBe(
			false,
		);
	});

	it('rejects fields the news endpoint does not document', () => {
		expect(accepts(inputs.news, { query: 'x', page: 1 })).toBe(false);
	});

	it('requires a query and accepts a batch', () => {
		expect(accepts(inputs.news, {})).toBe(false);
		expect(accepts(inputs.newsBatch, [{ query: 'a' }])).toBe(true);
		expect(accepts(inputs.newsBatch, [])).toBe(false);
	});
});

describe('web.ask input', () => {
	it('accepts a natural-language query', () => {
		expect(
			accepts(inputs.ask, { query: 'what shipped in AI this week?' }),
		).toBe(true);
	});

	it('enforces the 500 character cap', () => {
		expect(accepts(inputs.ask, { query: 'a'.repeat(500) })).toBe(true);
		expect(accepts(inputs.ask, { query: 'a'.repeat(501) })).toBe(false);
		expect(accepts(inputs.ask, { query: '' })).toBe(false);
	});

	it('rejects unknown keys', () => {
		expect(accepts(inputs.ask, { query: 'x', max_results: 5 })).toBe(false);
	});
});

describe('web.trending input', () => {
	it('accepts the documented platforms', () => {
		expect(accepts(inputs.trending, { search_service: 'github' })).toBe(true);
		expect(
			accepts(inputs.trending, {
				search_service: 'hackernews',
				max_results: 10,
			}),
		).toBe(true);
	});

	it('accepts any non-empty platform the spec leaves open', () => {
		expect(accepts(inputs.trending, { search_service: 'producthunt' })).toBe(
			true,
		);
	});

	it('requires a non-empty platform and rejects unknown keys', () => {
		expect(accepts(inputs.trending, {})).toBe(false);
		expect(accepts(inputs.trending, { search_service: '' })).toBe(false);
		expect(
			accepts(inputs.trending, { search_service: 'github', window: 'day' }),
		).toBe(false);
	});

	it('rejects non-positive max_results', () => {
		expect(
			accepts(inputs.trending, { search_service: 'github', max_results: 0 }),
		).toBe(false);
	});
});

describe('web.feedback input', () => {
	it('accepts the minimal report and the full agent shape', () => {
		expect(
			accepts(inputs.feedback, { message: 'crawl returned garbage' }),
		).toBe(true);
		expect(
			accepts(inputs.feedback, {
				message: 'crawl returned garbage',
				intent: 'crawl a docs page for the user',
				category: 'bug',
				request_id: 'req_8f3a',
				agent: { name: 'corsair', model: 'sonnet' },
			}),
		).toBe(true);
	});

	it('enforces the documented length caps', () => {
		expect(accepts(inputs.feedback, { message: 'a'.repeat(4000) })).toBe(true);
		expect(accepts(inputs.feedback, { message: 'a'.repeat(4001) })).toBe(false);
		expect(
			accepts(inputs.feedback, { message: 'x', intent: 'a'.repeat(2001) }),
		).toBe(false);
		expect(
			accepts(inputs.feedback, { message: 'x', request_id: 'a'.repeat(257) }),
		).toBe(false);
		expect(
			accepts(inputs.feedback, {
				message: 'x',
				agent: { name: 'a'.repeat(129) },
			}),
		).toBe(false);
	});

	it('rejects empty messages and undocumented categories or keys', () => {
		expect(accepts(inputs.feedback, {})).toBe(false);
		expect(accepts(inputs.feedback, { message: '' })).toBe(false);
		expect(
			accepts(inputs.feedback, { message: 'x', category: 'complaint' }),
		).toBe(false);
		expect(
			accepts(inputs.feedback, { message: 'x', agent: { version: '1' } }),
		).toBe(false);
		expect(accepts(inputs.feedback, { message: 'x', urgent: true })).toBe(
			false,
		);
	});
});

describe('content.crawl input', () => {
	it('accepts a url and the fallback flag', () => {
		expect(
			accepts(inputs.crawl, {
				url: 'https://example.com/docs',
				enableFallback: false,
			}),
		).toBe(true);
	});

	it('rejects non-URL strings and unknown keys', () => {
		expect(accepts(inputs.crawl, { url: 'not a url' })).toBe(false);
		expect(
			accepts(inputs.crawl, { url: 'https://example.com', depth: 2 }),
		).toBe(false);
	});

	it('accepts a batch of urls', () => {
		expect(
			accepts(inputs.crawlBatch, [
				{ url: 'https://example.com' },
				{ url: 'https://example.org', enableFallback: true },
			]),
		).toBe(true);
		expect(accepts(inputs.crawlBatch, [])).toBe(false);
	});
});

describe('content.screenshot input', () => {
	it('accepts the documented viewport controls', () => {
		expect(
			accepts(inputs.screenshot, {
				url: 'https://example.com',
				format: 'webp',
				full_page: true,
				viewport: {
					width: 1440,
					height: 900,
					device_scale_factor: 2,
				},
				wait_until: 'networkidle',
				wait_for_selector: '#main',
				selector: 'body',
				delay_ms: 500,
				timeout_ms: 30000,
				quality: 80,
				omit_background: false,
				color_scheme: 'dark',
				animations: 'disabled',
			}),
		).toBe(true);
	});

	it('enforces the documented ranges', () => {
		expect(
			accepts(inputs.screenshot, {
				url: 'https://example.com',
				viewport: { width: 100 },
			}),
		).toBe(false);
		expect(
			accepts(inputs.screenshot, {
				url: 'https://example.com',
				viewport: { height: 50 },
			}),
		).toBe(false);
		expect(
			accepts(inputs.screenshot, {
				url: 'https://example.com',
				delay_ms: 60000,
			}),
		).toBe(false);
		expect(
			accepts(inputs.screenshot, { url: 'https://example.com', quality: 101 }),
		).toBe(false);
	});

	it('rejects unsupported formats and wait strategies', () => {
		expect(
			accepts(inputs.screenshot, { url: 'https://example.com', format: 'gif' }),
		).toBe(false);
		expect(
			accepts(inputs.screenshot, {
				url: 'https://example.com',
				wait_until: 'idle',
			}),
		).toBe(false);
	});
});

describe('content.sitemap input', () => {
	it('accepts both documented crawl modes', () => {
		expect(accepts(inputs.sitemap, { url: 'https://example.com' })).toBe(true);
		expect(
			accepts(inputs.sitemap, { url: 'https://example.com', type: 'all' }),
		).toBe(true);
	});

	it('rejects unknown modes', () => {
		expect(
			accepts(inputs.sitemap, { url: 'https://example.com', type: 'deep' }),
		).toBe(false);
	});
});

describe('content.extract input', () => {
	it('accepts a url with a prompt and response format', () => {
		expect(
			accepts(inputs.extract, {
				url: 'https://example.com/pricing',
				prompt: 'List the pricing tiers',
				response_format: {
					type: 'object',
					properties: { tiers: { type: 'array' } },
				},
			}),
		).toBe(true);
	});

	it('accepts a bare url and rejects empty urls', () => {
		expect(accepts(inputs.extract, { url: 'https://example.com' })).toBe(true);
		expect(accepts(inputs.extract, { url: '' })).toBe(false);
		expect(accepts(inputs.extract, {})).toBe(false);
	});
});

describe('deepcrawl inputs', () => {
	it('accepts a start request', () => {
		expect(
			accepts(inputs.deepcrawlStart, {
				url: 'https://example.com',
				type: 'sitemap',
			}),
		).toBe(true);
	});

	it('rejects unknown start fields', () => {
		expect(
			accepts(inputs.deepcrawlStart, {
				url: 'https://example.com',
				maxPages: 100,
			}),
		).toBe(false);
	});

	it('requires a non-empty task id for status checks', () => {
		expect(accepts(inputs.deepcrawlStatus, { taskId: 'abc' })).toBe(true);
		expect(accepts(inputs.deepcrawlStatus, { taskId: '' })).toBe(false);
		expect(accepts(inputs.deepcrawlStatus, {})).toBe(false);
	});
});

describe('account.usage input', () => {
	it('accepts an empty object or a documented period', () => {
		expect(accepts(inputs.usage, {})).toBe(true);
		expect(accepts(inputs.usage, { period: 'month' })).toBe(true);
		expect(accepts(inputs.usage, { period: 'day' })).toBe(true);
	});

	it('rejects undocumented periods and keys', () => {
		expect(accepts(inputs.usage, { period: 'hour' })).toBe(false);
		expect(accepts(inputs.usage, { period: null })).toBe(false);
		expect(accepts(inputs.usage, { verbose: true })).toBe(false);
	});
});

describe('account.health input', () => {
	it('accepts only an empty object', () => {
		expect(accepts(inputs.health, {})).toBe(true);
		expect(accepts(inputs.health, { verbose: true })).toBe(false);
	});
});

describe('outputs', () => {
	it('validates a search response with metadata and images', () => {
		expect(
			accepts(outputs.search, {
				searchParameters: { query: 'corsair', max_results: 5 },
				results: [
					{
						title: 'Corsair',
						link: 'https://example.com',
						snippet: 'integration layer',
						content: 'full page text',
						published_date: '2026-01-02',
						metadata: { kind: 'repo', stars: 1200, language: 'TypeScript' },
					},
				],
				images: ['https://example.com/img.png'],
			}),
		).toBe(true);
		expect(
			accepts(outputs.search, {
				searchParameters: { query: 'x' },
				results: [{ title: 'no link' }],
			}),
		).toBe(false);
	});

	it('validates batch responses with per-query errors', () => {
		expect(
			accepts(outputs.searchBatch, {
				results: [
					{
						success: true,
						data: { searchParameters: { query: 'a' }, results: [] },
						cost: 1,
					},
					{
						success: false,
						error: { message: 'engine unavailable', statusCode: 502 },
						cost: 0,
					},
				],
				summary: { total: 2, successful: 1, failed: 1, totalCost: 1 },
			}),
		).toBe(true);
		expect(
			accepts(outputs.searchBatch, {
				results: [],
			}),
		).toBe(false);
	});

	it('validates news responses', () => {
		expect(
			accepts(outputs.news, {
				searchParameters: { query: 'ai', search_service: 'reuters' },
				results: [
					{
						title: 'Story',
						link: 'https://example.com/story',
						snippet: 'summary',
					},
				],
			}),
		).toBe(true);
		expect(
			accepts(outputs.news, {
				searchParameters: { query: 'ai' },
				results: 'nope',
			}),
		).toBe(false);
	});

	it('validates ask responses including errors and intent', () => {
		expect(
			accepts(outputs.ask, {
				query: 'what is new?',
				intent: {
					search_query: 'new releases',
					sources: ['google', 'github'],
					time_range: 'week',
				},
				results: [
					{
						title: 'Release',
						link: 'https://example.com/release',
						snippet: 'v2',
						source: 'github',
						relevance: 0.93,
					},
				],
				errors: [{ source: 'reddit', message: 'no results' }],
			}),
		).toBe(true);
		expect(
			accepts(outputs.ask, {
				query: 'x',
				intent: { search_query: 'x', sources: [], time_range: null },
				results: [],
			}),
		).toBe(false);
		expect(
			accepts(outputs.ask, {
				query: 'x',
				intent: { search_query: 'x', sources: [], time_range: null },
				results: [{ title: 'a', link: 'l', snippet: 's' }],
				errors: [],
			}),
		).toBe(false);
	});

	it('validates trending responses', () => {
		expect(
			accepts(outputs.trending, {
				trendingParameters: { search_service: 'hackernews', max_results: 10 },
				results: [
					{
						title: 'Show HN: thing',
						url: 'https://news.ycombinator.com/item?id=1',
						description: null,
					},
				],
			}),
		).toBe(true);
		expect(
			accepts(outputs.trending, {
				trendingParameters: { search_service: 'github' },
				results: [{ title: 'no url' }],
			}),
		).toBe(false);
	});

	it('validates crawl responses with metadata', () => {
		expect(
			accepts(outputs.crawl, {
				crawlParameters: { url: 'https://example.com' },
				results: {
					title: 'Example',
					link: 'https://example.com',
					content: '# Hello',
					metadata: { language: 'en', statusCode: 200 },
				},
			}),
		).toBe(true);
		expect(
			accepts(outputs.crawl, {
				crawlParameters: { url: 'https://example.com' },
				results: { title: 'Example', link: 'https://example.com' },
			}),
		).toBe(false);
	});

	it('validates crawl batches', () => {
		const page = {
			crawlParameters: { url: 'https://example.com' },
			results: { title: 'Example', link: 'https://example.com', content: 'x' },
		};
		expect(accepts(outputs.crawlBatch, [page, page])).toBe(true);
	});

	it('accepts an all-fail crawl batch and still rejects an empty request', () => {
		expect(accepts(outputs.crawlBatch, [])).toBe(true);
		expect(accepts(inputs.crawlBatch, [])).toBe(false);
	});

	it('validates screenshot files', () => {
		expect(
			accepts(outputs.screenshot, {
				contentType: 'image/png',
				base64: 'aGVsbG8=',
				sizeBytes: 5,
			}),
		).toBe(true);
		expect(
			accepts(outputs.screenshot, {
				contentType: 'image/png',
				base64: '',
				sizeBytes: 0,
			}),
		).toBe(false);
	});

	it('validates sitemap responses', () => {
		expect(
			accepts(outputs.sitemap, { links: ['https://example.com', '/docs'] }),
		).toBe(true);
		expect(accepts(outputs.sitemap, { links: 'nope' })).toBe(false);
	});

	it('only accepts the documented extract success shape', () => {
		expect(
			accepts(outputs.extract, {
				success: true,
				extractParameters: { url: 'https://example.com' },
				results: { tiers: [{ name: 'Pro' }] },
			}),
		).toBe(true);
		expect(
			accepts(outputs.extract, {
				success: false,
				extractParameters: { url: 'https://example.com' },
				results: {},
			}),
		).toBe(false);
	});

	it('validates deepcrawl accepted and status responses', () => {
		expect(
			accepts(outputs.deepcrawlStart, { taskId: 't1', status: 'queued' }),
		).toBe(true);
		expect(
			accepts(outputs.deepcrawlStart, { taskId: 't1', status: 'processing' }),
		).toBe(false);
		expect(
			accepts(outputs.deepcrawlStatus, {
				taskId: 't1',
				status: 'completed',
				success: true,
				r2Key: 'tasks/t1.zip',
				zipUrl: 'https://cdn.example.com/t1.zip',
			}),
		).toBe(true);
		expect(
			accepts(outputs.deepcrawlStatus, { taskId: 't1', status: 'exploded' }),
		).toBe(false);
	});

	it('validates usage responses for both credential types', () => {
		expect(
			accepts(outputs.usage, {
				usage: 100,
				user_id: null,
				credential_type: 'api_key',
				client_id: null,
			}),
		).toBe(true);
		expect(accepts(outputs.usage, { usage: 0, credential_type: 'oauth' })).toBe(
			true,
		);
		expect(accepts(outputs.usage, { usage: 10 })).toBe(false);
	});

	it('validates feedback acknowledgements', () => {
		expect(accepts(outputs.feedback, { id: 'fb_abc123', status: 'new' })).toBe(
			true,
		);
		expect(
			accepts(outputs.feedback, { id: 'fb_abc-DEF_456', status: 'new' }),
		).toBe(true);
		expect(accepts(outputs.feedback, { id: 'req_8f3a', status: 'new' })).toBe(
			false,
		);
		expect(accepts(outputs.feedback, { id: 'fb_abc123' })).toBe(false);
		expect(accepts(outputs.feedback, { id: '', status: 'new' })).toBe(false);
	});

	it('validates health responses with optional metadata', () => {
		expect(accepts(outputs.health, { status: 'ok' })).toBe(true);
		expect(
			accepts(outputs.health, {
				status: 'ok',
				timestamp: '2026-10-16T00:00:00Z',
				version: '1.2.3',
			}),
		).toBe(true);
		expect(accepts(outputs.health, {})).toBe(false);
		expect(accepts(outputs.health, { status: 200 })).toBe(false);
	});
});
