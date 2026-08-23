import 'dotenv/config';
import { Tavily } from './endpoints';
import type { TavilyMcpContext } from './index';

/**
 * Live suite. Excluded from CI by filename; run with a real key:
 *   TAVILY_API_KEY=... npx jest api.test
 *
 * These call the endpoint handlers rather than the client directly, so a run
 * exercises input parsing, the request body, and output-schema validation
 * against real Tavily responses.
 */

const TEST_API_KEY = process.env.TAVILY_API_KEY;

const upserts: Array<[string, Record<string, unknown>]> = [];

const makeEntity = () => ({
	upsertByEntityId: async (id: string, data: Record<string, unknown>) => {
		upserts.push([id, data]);
	},
});

const ctx = {
	key: TEST_API_KEY,
	db: {
		searchResults: makeEntity(),
		extractResults: makeEntity(),
		crawlResults: makeEntity(),
		mapResults: makeEntity(),
		researchResults: makeEntity(),
	},
} as unknown as TavilyMcpContext;

beforeEach(() => {
	upserts.length = 0;
});

describe('Tavily live API', () => {
	it('search returns a response matching the output schema', async () => {
		const response = await Tavily.search(ctx, {
			query: 'what is the model context protocol',
			max_results: 3,
			include_usage: true,
		});

		expect(response.results.length).toBeGreaterThan(0);
		expect(response.query).toBeTruthy();
		expect(upserts).toHaveLength(response.results.length);
		// Rows are scoped by query, with both halves URI-encoded.
		const prefix = `${encodeURIComponent('what is the model context protocol')}:`;
		for (const [id] of upserts) {
			expect(id.startsWith(prefix)).toBe(true);
			expect(decodeURIComponent(id.slice(prefix.length))).toMatch(/^https?:/);
		}
	}, 60_000);

	it('search with an answer and raw content returns the documented shape', async () => {
		const response = await Tavily.search(ctx, {
			query: 'what is retrieval augmented generation',
			search_depth: 'advanced',
			include_answer: 'advanced',
			include_raw_content: 'markdown',
			include_favicon: true,
			max_results: 2,
		});

		expect(typeof response.answer).toBe('string');
	}, 60_000);

	it('extract returns a response matching the output schema', async () => {
		const response = await Tavily.extract(ctx, {
			urls: ['https://docs.tavily.com/welcome'],
			include_usage: true,
		});

		expect(response.results.length + response.failed_results.length).toBe(1);
	}, 60_000);

	it('map returns a response matching the output schema', async () => {
		const response = await Tavily.map(ctx, {
			url: 'https://docs.tavily.com',
			limit: 5,
		});

		expect(response.base_url).toBeTruthy();
		expect(response.results.length).toBeGreaterThan(0);
	}, 60_000);

	it('crawl returns a response matching the output schema', async () => {
		const response = await Tavily.crawl(ctx, {
			url: 'https://docs.tavily.com',
			limit: 3,
			max_depth: 1,
			categories: ['Documentation'],
		});

		expect(response.base_url).toBeTruthy();
		expect(response.results.length).toBeGreaterThan(0);
	}, 120_000);

	it('research polls to completion and persists the report', async () => {
		const response = await Tavily.research(ctx, {
			input: 'What is the Tavily search API used for? One short paragraph.',
			model: 'mini',
			output_length: 'short',
			poll_interval_ms: 5_000,
			max_wait_ms: 300_000,
		});

		expect(response.status).toBe('completed');
		expect(response.request_id).toBeTruthy();
		// The create call returns input/model; the status polls do not.
		expect(response.input).toBeTruthy();
		expect(upserts).toHaveLength(1);
		expect(upserts[0]?.[0]).toBe(response.request_id);
	}, 330_000);

	it('surfaces an invalid key as a 401', async () => {
		const badCtx = { ...ctx, key: 'tvly-dev-000000000000000000000000000000' };

		await expect(
			Tavily.search(badCtx as TavilyMcpContext, { query: 'hello world' }),
		).rejects.toMatchObject({ status: 401 });
	}, 60_000);
});
