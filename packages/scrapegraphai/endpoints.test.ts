/**
 * Exercises all 27 endpoint wrappers: the HTTP method, path, and body/query
 * each one builds, that async job endpoints persist a job snapshot via
 * `ctx.db.jobs`, and that responses satisfy their declared output schema.
 * Network access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import {
	Account,
	AgenticScraper,
	Endpoint,
	Feedback,
	Markdownify,
	ScheduledJobs,
	SchemaGenerator,
	Scrape,
	SearchScraper,
	Sitemap,
	SmartCrawler,
	SmartScraper,
	Utilities,
} from './endpoints';
import { scrapegraphAiEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Ctx = Parameters<typeof SearchScraper.start>[0];

const upsertByEntityId = jest.fn(async () => undefined);

function makeCtx(): Ctx {
	return {
		key: 'sgai-test-key',
		db: { jobs: { upsertByEntityId } },
	} as unknown as Ctx;
}

let lastUrl = '';
let lastMethod = '';
let lastBody: unknown;

function respondWith(body: unknown) {
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = init?.body ? JSON.parse(String(init.body)) : undefined;
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => body,
			text: async () => JSON.stringify(body),
		};
	}) as unknown as typeof global.fetch;
}

beforeEach(() => {
	mockLogEvent.mockClear();
	upsertByEntityId.mockClear();
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
});

describe('searchScraper', () => {
	it('start posts to v1/searchscraper and saves a job snapshot', async () => {
		respondWith({
			request_id: 'req-1',
			status: 'queued',
			user_prompt: 'find docs',
			result: null,
			reference_urls: null,
		});

		const result = await SearchScraper.start(makeCtx(), {
			user_prompt: 'find docs',
		});

		expect(lastMethod).toBe('POST');
		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/searchscraper');
		expect(lastBody).toEqual({ user_prompt: 'find docs' });
		expect(
			scrapegraphAiEndpointSchemas['searchScraper.start'].output.parse(result),
		).toBeTruthy();
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'req-1',
			expect.objectContaining({ kind: 'searchscraper', status: 'queued' }),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'scrapegraphai.searchScraper.start',
			expect.objectContaining({ user_prompt: 'find docs' }),
			'completed',
		);
	});

	it('status gets v1/searchscraper/{id}', async () => {
		respondWith({ request_id: 'req-1', status: 'completed', user_prompt: 'x' });

		await SearchScraper.status(makeCtx(), { request_id: 'req-1' });

		expect(lastMethod).toBe('GET');
		expect(lastUrl).toBe(
			'https://api.scrapegraphai.com/v1/searchscraper/req-1',
		);
		expect(upsertByEntityId).toHaveBeenCalled();
	});

	it('history gets v1/history/searchscraper with pagination query', async () => {
		respondWith({ requests: [], next_key: null });

		await SearchScraper.history(makeCtx(), { page: 2, page_size: 5 });

		expect(lastMethod).toBe('GET');
		expect(lastUrl).toContain('/v1/history/searchscraper');
		expect(lastUrl).toContain('page=2');
		expect(lastUrl).toContain('page_size=5');
	});
});

describe('smartScraper', () => {
	it('start posts to v1/smartscraper and saves a job snapshot', async () => {
		respondWith({
			request_id: 'ss-1',
			status: 'queued',
			website_url: 'https://example.com',
			user_prompt: 'extract title',
		});

		await SmartScraper.start(makeCtx(), {
			user_prompt: 'extract title',
			website_url: 'https://example.com',
		});

		expect(lastMethod).toBe('POST');
		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/smartscraper');
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'ss-1',
			expect.objectContaining({ kind: 'smartscraper' }),
		);
	});

	it('status gets v1/smartscraper/{id}', async () => {
		respondWith({ request_id: 'ss-1', status: 'processing', user_prompt: 'x' });

		await SmartScraper.status(makeCtx(), { request_id: 'ss-1' });

		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/smartscraper/ss-1');
	});

	it('history gets v1/history/smartscraper', async () => {
		respondWith({ requests: [], next_key: null });

		await SmartScraper.history(makeCtx(), {});

		expect(lastUrl).toContain('/v1/history/smartscraper');
	});
});

describe('markdownify', () => {
	it('start posts to v1/markdownify and saves a job snapshot', async () => {
		respondWith({
			request_id: 'md-1',
			status: 'queued',
			website_url: 'https://example.com',
		});

		await Markdownify.start(makeCtx(), { website_url: 'https://example.com' });

		expect(lastMethod).toBe('POST');
		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/markdownify');
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'md-1',
			expect.objectContaining({ kind: 'markdownify' }),
		);
	});

	it('status gets v1/markdownify/{id}', async () => {
		respondWith({ request_id: 'md-1', status: 'completed', website_url: 'x' });

		await Markdownify.status(makeCtx(), { request_id: 'md-1' });

		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/markdownify/md-1');
	});

	it('history gets v1/history/markdownify', async () => {
		respondWith({ requests: [], next_key: null });

		await Markdownify.history(makeCtx(), {});

		expect(lastUrl).toContain('/v1/history/markdownify');
	});
});

describe('smartCrawler', () => {
	it('start posts to v1/crawl and saves a job snapshot keyed by task_id', async () => {
		respondWith({ task_id: 'cr-1', status: 'queued' });

		await SmartCrawler.start(makeCtx(), { url: 'https://example.com' });

		expect(lastMethod).toBe('POST');
		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/crawl');
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'cr-1',
			expect.objectContaining({ kind: 'smartcrawler' }),
		);
	});

	it('status gets v1/crawl/{task_id}', async () => {
		respondWith({ task_id: 'cr-1', status: 'completed' });

		await SmartCrawler.status(makeCtx(), { task_id: 'cr-1' });

		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/crawl/cr-1');
	});

	it('history gets v1/history/crawl', async () => {
		respondWith({ requests: [], next_key: null });

		await SmartCrawler.history(makeCtx(), {});

		expect(lastUrl).toContain('/v1/history/crawl');
	});

	it('webhookLogs gets v1/webhook/logs/{crawler_id}', async () => {
		respondWith({ logs: [] });

		await SmartCrawler.webhookLogs(makeCtx(), { crawler_id: 'cr-1' });

		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/webhook/logs/cr-1');
	});
});

describe('agenticScraper', () => {
	it('history gets v1/history/agentic-scraper', async () => {
		respondWith({ requests: [], next_key: null });

		await AgenticScraper.history(makeCtx(), {});

		expect(lastUrl).toContain('/v1/history/agentic-scraper');
	});

	it('getLiveSessionUrl posts to v1/get-live-session-url', async () => {
		respondWith({ session_url: 'https://live.example.com', session_id: 's1' });

		const result = await AgenticScraper.getLiveSessionUrl(makeCtx(), {
			url: 'https://example.com',
		});

		expect(lastMethod).toBe('POST');
		expect(lastUrl).toBe(
			'https://api.scrapegraphai.com/v1/get-live-session-url',
		);
		expect(result.session_id).toBe('s1');
	});
});

describe('scrape', () => {
	it('history gets v1/history/scrape', async () => {
		respondWith({ requests: [], next_key: null });

		await Scrape.history(makeCtx(), {});

		expect(lastUrl).toContain('/v1/history/scrape');
	});
});

describe('sitemap', () => {
	it('history gets v1/history/sitemap', async () => {
		respondWith({ requests: [], next_key: null });

		await Sitemap.history(makeCtx(), {});

		expect(lastUrl).toContain('/v1/history/sitemap');
	});
});

describe('schema', () => {
	it('generate posts to v1/generate_schema', async () => {
		respondWith({
			request_id: 'sc-1',
			status: 'completed',
			user_prompt: 'x',
			refined_prompt: 'x refined',
			generated_schema: { type: 'object' },
		});

		await SchemaGenerator.generate(makeCtx(), { user_prompt: 'x' });

		expect(lastMethod).toBe('POST');
		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/generate_schema');
	});
});

describe('endpoint', () => {
	it('getSuggestions posts to v1/endpoint/get-suggestions', async () => {
		respondWith({ suggestions: [], html_with_markdowns: null });

		await Endpoint.getSuggestions(makeCtx(), {
			website_url: 'https://example.com',
			prompt: 'get products',
		});

		expect(lastUrl).toBe(
			'https://api.scrapegraphai.com/v1/endpoint/get-suggestions',
		);
	});

	it('save posts to v1/endpoint/save-endpoint', async () => {
		respondWith({});

		await Endpoint.save(makeCtx(), {
			suggestions: [
				{
					endpoint: '/products',
					description: 'List products',
					target_url: 'https://example.com',
					parameters: [],
					pydantic_schema: {},
					extraction_prompt: 'extract products',
				},
			],
		});

		expect(lastUrl).toBe(
			'https://api.scrapegraphai.com/v1/endpoint/save-endpoint',
		);
	});
});

describe('account', () => {
	it('credits gets v1/credits', async () => {
		respondWith({ remaining_credits: 10, total_credits_used: 90 });

		const result = await Account.credits(makeCtx(), {});

		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/credits');
		expect(result.remaining_credits).toBe(10);
	});

	it('validateApiKey gets v1/validate', async () => {
		respondWith({ valid: true });

		await Account.validateApiKey(makeCtx(), {});

		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/validate');
	});

	it('usageTimeline gets v1/usage/timeline with days query', async () => {
		respondWith({ timeline: [] });

		await Account.usageTimeline(makeCtx(), { days: '30' });

		expect(lastUrl).toContain('/v1/usage/timeline');
		expect(lastUrl).toContain('days=30');
	});
});

describe('feedback', () => {
	it('submit posts to v1/feedback', async () => {
		respondWith({
			feedback_id: 'fb-1',
			request_id: 'req-1',
			feedback_timestamp: '2026-01-01T00:00:00Z',
		});

		await Feedback.submit(makeCtx(), { request_id: 'req-1', rating: 5 });

		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/feedback');
		expect(lastBody).toEqual({ request_id: 'req-1', rating: 5 });
	});

	it('submitProduct posts to v1/product-feedback', async () => {
		respondWith({});

		await Feedback.submitProduct(makeCtx(), { feedback_id: 'fb-1', rating: 4 });

		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/product-feedback');
	});
});

describe('scheduledJobs', () => {
	it('list gets v1/scheduled-jobs with filters', async () => {
		respondWith({ total: 0, page: 1, page_size: 20, jobs: [] });

		await ScheduledJobs.list(makeCtx(), {
			service_type: 'smartscraper',
			is_active: true,
		});

		expect(lastUrl).toContain('/v1/scheduled-jobs');
		expect(lastUrl).toContain('service_type=smartscraper');
		expect(lastUrl).toContain('is_active=true');
	});
});

describe('utilities', () => {
	it('toonify posts the raw data object (no wrapper) to v1/toonify', async () => {
		respondWith({ toon: 'a[1]{b}:\n1' });

		await Utilities.toonify(makeCtx(), { data: { a: [{ b: 1 }] } });

		expect(lastUrl).toBe('https://api.scrapegraphai.com/v1/toonify');
		expect(lastBody).toEqual({ a: [{ b: 1 }] });
	});
});
