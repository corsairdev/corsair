import * as client from '../client';
import type { TavilyMcpContext } from '../index';
import { Tavily } from './index';
import type {
	TavilyCrawlResponse,
	TavilyExtractResponse,
	TavilyMapResponse,
	TavilyResearchRequest,
	TavilyResearchResponse,
	TavilySearchResponse,
} from './types';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	makeTavilyMcpRequest: jest.fn(),
}));

const mockedRequest = client.makeTavilyMcpRequest as jest.MockedFunction<
	typeof client.makeTavilyMcpRequest
>;

type UpsertMock = jest.Mock<Promise<void>, [string, Record<string, unknown>]>;

type Upserts = {
	searchResults: UpsertMock;
	extractResults: UpsertMock;
	crawlResults: UpsertMock;
	mapResults: UpsertMock;
	researchResults: UpsertMock;
};

/**
 * Builds a minimal plugin context. Only `key` and the entity upserts the
 * endpoints touch are populated, so the double stays readable; the cast goes
 * through `unknown` rather than `any` to keep the assertion explicit.
 */
function createContext(): { ctx: TavilyMcpContext; upserts: Upserts } {
	const makeUpsert = (): UpsertMock =>
		jest.fn<Promise<void>, [string, Record<string, unknown>]>(
			async () => undefined,
		);

	const upserts: Upserts = {
		searchResults: makeUpsert(),
		extractResults: makeUpsert(),
		crawlResults: makeUpsert(),
		mapResults: makeUpsert(),
		researchResults: makeUpsert(),
	};

	const ctx = {
		key: 'tvly-test-key',
		db: {
			searchResults: { upsertByEntityId: upserts.searchResults },
			extractResults: { upsertByEntityId: upserts.extractResults },
			crawlResults: { upsertByEntityId: upserts.crawlResults },
			mapResults: { upsertByEntityId: upserts.mapResults },
			researchResults: { upsertByEntityId: upserts.researchResults },
		},
	} as unknown as TavilyMcpContext;

	return { ctx, upserts };
}

let ctx: TavilyMcpContext;
let upserts: Upserts;
let warnSpy: jest.SpyInstance;

beforeEach(() => {
	jest.clearAllMocks();
	({ ctx, upserts } = createContext());
	warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	warnSpy.mockRestore();
});

// ─────────────────────────────────────────────────────────────────────────────
// search
// ─────────────────────────────────────────────────────────────────────────────

describe('search', () => {
	const response: TavilySearchResponse = {
		query: 'model context protocol',
		answer: 'MCP is an open standard.',
		images: [],
		results: [
			{
				title: 'Introduction',
				url: 'https://modelcontextprotocol.io/introduction',
				content: 'MCP standardises how apps provide context to LLMs.',
				score: 0.97,
			},
			{
				title: 'Spec',
				url: 'https://modelcontextprotocol.io/spec',
				content: 'The specification.',
				score: 0.81,
			},
		],
		response_time: 1.42,
	};

	it('posts the input to the search endpoint', async () => {
		mockedRequest.mockResolvedValueOnce(response);
		const input = { query: 'model context protocol', max_results: 2 };

		await Tavily.search(ctx, input);

		expect(mockedRequest).toHaveBeenCalledWith('search', ctx.key, {
			method: 'POST',
			body: input,
		});
	});

	it('returns the response unchanged', async () => {
		mockedRequest.mockResolvedValueOnce(response);

		const result = await Tavily.search(ctx, { query: 'mcp' });

		expect(result).toEqual(response);
	});

	it('persists every result keyed by query and url', async () => {
		mockedRequest.mockResolvedValueOnce(response);

		await Tavily.search(ctx, { query: 'model context protocol' });

		expect(upserts.searchResults).toHaveBeenCalledTimes(2);
		expect(upserts.searchResults).toHaveBeenNthCalledWith(
			1,
			'model%20context%20protocol:https%3A%2F%2Fmodelcontextprotocol.io%2Fintroduction',
			expect.objectContaining({
				url: 'https://modelcontextprotocol.io/introduction',
				title: 'Introduction',
				score: 0.97,
				query: 'model context protocol',
				searchedAt: expect.any(Date),
			}),
		);
	});

	it('keeps one row per query when two queries return the same url', async () => {
		mockedRequest.mockResolvedValueOnce(response).mockResolvedValueOnce({
			...response,
			query: 'mcp spec',
		});

		await Tavily.search(ctx, { query: 'model context protocol' });
		await Tavily.search(ctx, { query: 'mcp spec' });

		const keys = upserts.searchResults.mock.calls.map(([key]) => key);
		expect(new Set(keys).size).toBe(keys.length);
		expect(keys).toContain(
			'model%20context%20protocol:https%3A%2F%2Fmodelcontextprotocol.io%2Fintroduction',
		);
		expect(keys).toContain(
			'mcp%20spec:https%3A%2F%2Fmodelcontextprotocol.io%2Fintroduction',
		);
	});

	it('keeps the key unique when the query contains the separator', async () => {
		const hit = (url: string): TavilySearchResponse => ({
			query: 'q',
			images: [],
			results: [{ title: 'T', url, content: 'c', score: 0.5 }],
			response_time: 0.1,
		});

		// Both pairs collapse to `read mailto:foo:https://a.com` when the raw
		// values are joined, and both URLs are valid.
		mockedRequest
			.mockResolvedValueOnce(hit('https://a.com'))
			.mockResolvedValueOnce(hit('foo:https://a.com'));

		await Tavily.search(ctx, { query: 'read mailto:foo' });
		await Tavily.search(ctx, { query: 'read mailto' });

		const keys = upserts.searchResults.mock.calls.map(([key]) => key);
		expect(keys).toHaveLength(2);
		expect(keys[0]).not.toBe(keys[1]);
	});

	it('builds the same key for the same query and url', async () => {
		mockedRequest
			.mockResolvedValueOnce(response)
			.mockResolvedValueOnce(response);

		await Tavily.search(ctx, { query: 'model context protocol' });
		await Tavily.search(ctx, { query: 'model context protocol' });

		const keys = upserts.searchResults.mock.calls.map(([key]) => key);
		expect(keys.slice(0, 2)).toEqual(keys.slice(2, 4));
	});

	it('still returns results when persistence fails', async () => {
		mockedRequest.mockResolvedValueOnce(response);
		upserts.searchResults.mockRejectedValue(new Error('db offline'));

		const result = await Tavily.search(ctx, { query: 'mcp' });

		expect(result).toEqual(response);
		expect(warnSpy).toHaveBeenCalledTimes(2);
	});

	it('propagates API errors', async () => {
		mockedRequest.mockRejectedValueOnce(new Error('Too Many Requests'));

		await expect(Tavily.search(ctx, { query: 'mcp' })).rejects.toThrow(
			'Too Many Requests',
		);
		expect(upserts.searchResults).not.toHaveBeenCalled();
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// extract
// ─────────────────────────────────────────────────────────────────────────────

describe('extract', () => {
	const response: TavilyExtractResponse = {
		results: [
			{ url: 'https://example.com/a', raw_content: '# A' },
			{ url: 'https://example.com/b', raw_content: '# B' },
		],
		failed_results: [{ url: 'https://example.com/c', error: 'timeout' }],
		response_time: 0.8,
	};

	it('posts the input to the extract endpoint', async () => {
		mockedRequest.mockResolvedValueOnce(response);
		const input = {
			urls: ['https://example.com/a', 'https://example.com/b'],
			format: 'markdown' as const,
		};

		await Tavily.extract(ctx, input);

		expect(mockedRequest).toHaveBeenCalledWith('extract', ctx.key, {
			method: 'POST',
			body: input,
		});
	});

	it('persists successful results only, keyed by url', async () => {
		mockedRequest.mockResolvedValueOnce(response);

		await Tavily.extract(ctx, { urls: 'https://example.com/a' });

		expect(upserts.extractResults).toHaveBeenCalledTimes(2);
		expect(upserts.extractResults).toHaveBeenNthCalledWith(
			1,
			'https://example.com/a',
			expect.objectContaining({
				url: 'https://example.com/a',
				raw_content: '# A',
				extractedAt: expect.any(Date),
			}),
		);
	});

	it('surfaces failed_results to the caller', async () => {
		mockedRequest.mockResolvedValueOnce(response);

		const result = await Tavily.extract(ctx, {
			urls: 'https://example.com/c',
		});

		expect(result.failed_results).toEqual([
			{ url: 'https://example.com/c', error: 'timeout' },
		]);
	});

	it('still returns results when persistence fails', async () => {
		mockedRequest.mockResolvedValueOnce(response);
		upserts.extractResults.mockRejectedValue(new Error('db offline'));

		await expect(
			Tavily.extract(ctx, { urls: 'https://example.com/a' }),
		).resolves.toEqual(response);
		expect(warnSpy).toHaveBeenCalledTimes(2);
	});

	it('propagates API errors', async () => {
		mockedRequest.mockRejectedValueOnce(new Error('Unauthorized'));

		await expect(
			Tavily.extract(ctx, { urls: 'https://example.com/a' }),
		).rejects.toThrow('Unauthorized');
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// crawl
// ─────────────────────────────────────────────────────────────────────────────

describe('crawl', () => {
	const response: TavilyCrawlResponse = {
		base_url: 'https://docs.tavily.com',
		results: [
			{ url: 'https://docs.tavily.com/welcome', raw_content: '# Welcome' },
		],
		failed_results: [],
		response_time: 4.1,
	};

	it('forwards depth and breadth to the crawl endpoint', async () => {
		mockedRequest.mockResolvedValueOnce(response);
		const input = {
			url: 'https://docs.tavily.com',
			max_depth: 2,
			max_breadth: 10,
			limit: 25,
		};

		await Tavily.crawl(ctx, input);

		expect(mockedRequest).toHaveBeenCalledWith('crawl', ctx.key, {
			method: 'POST',
			body: input,
		});
	});

	it('persists each page stamped with the crawl base url', async () => {
		mockedRequest.mockResolvedValueOnce(response);

		await Tavily.crawl(ctx, { url: 'https://docs.tavily.com' });

		expect(upserts.crawlResults).toHaveBeenCalledWith(
			'https://docs.tavily.com/welcome',
			expect.objectContaining({
				url: 'https://docs.tavily.com/welcome',
				raw_content: '# Welcome',
				baseUrl: 'https://docs.tavily.com',
				crawledAt: expect.any(Date),
			}),
		);
	});

	it('still returns results when persistence fails', async () => {
		mockedRequest.mockResolvedValueOnce(response);
		upserts.crawlResults.mockRejectedValue(new Error('db offline'));

		await expect(
			Tavily.crawl(ctx, { url: 'https://docs.tavily.com' }),
		).resolves.toEqual(response);
		expect(warnSpy).toHaveBeenCalledTimes(1);
	});

	it('propagates API errors', async () => {
		mockedRequest.mockRejectedValueOnce(new Error('crawl failed'));

		await expect(
			Tavily.crawl(ctx, { url: 'https://docs.tavily.com' }),
		).rejects.toThrow('crawl failed');
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// map
// ─────────────────────────────────────────────────────────────────────────────

describe('map', () => {
	const response: TavilyMapResponse = {
		base_url: 'https://docs.tavily.com',
		results: [
			'https://docs.tavily.com/welcome',
			'https://docs.tavily.com/quickstart',
		],
		response_time: 2.2,
	};

	it('forwards depth and breadth to the map endpoint', async () => {
		mockedRequest.mockResolvedValueOnce(response);
		const input = {
			url: 'https://docs.tavily.com',
			max_depth: 1,
			max_breadth: 20,
		};

		await Tavily.map(ctx, input);

		expect(mockedRequest).toHaveBeenCalledWith('map', ctx.key, {
			method: 'POST',
			body: input,
		});
	});

	it('persists one row per url string', async () => {
		mockedRequest.mockResolvedValueOnce(response);

		await Tavily.map(ctx, { url: 'https://docs.tavily.com' });

		expect(upserts.mapResults).toHaveBeenCalledTimes(2);
		expect(upserts.mapResults).toHaveBeenNthCalledWith(
			2,
			'https://docs.tavily.com/quickstart',
			expect.objectContaining({
				url: 'https://docs.tavily.com/quickstart',
				baseUrl: 'https://docs.tavily.com',
				mappedAt: expect.any(Date),
			}),
		);
	});

	it('returns an empty list without persisting anything', async () => {
		mockedRequest.mockResolvedValueOnce({
			...response,
			results: [],
		} satisfies TavilyMapResponse);

		const result = await Tavily.map(ctx, { url: 'https://docs.tavily.com' });

		expect(result.results).toEqual([]);
		expect(upserts.mapResults).not.toHaveBeenCalled();
	});

	it('propagates API errors', async () => {
		mockedRequest.mockRejectedValueOnce(new Error('map failed'));

		await expect(
			Tavily.map(ctx, { url: 'https://docs.tavily.com' }),
		).rejects.toThrow('map failed');
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// research
// ─────────────────────────────────────────────────────────────────────────────

describe('research', () => {
	const queued: TavilyResearchResponse = {
		request_id: 'req-123',
		status: 'pending',
		input: 'state of MCP adoption',
		model: 'auto',
		created_at: '2026-08-22T12:00:00Z',
		response_time: 0.1,
	};

	const completed: TavilyResearchResponse = {
		request_id: 'req-123',
		status: 'completed',
		content: 'MCP adoption is growing.',
		sources: [{ title: 'Spec', url: 'https://modelcontextprotocol.io' }],
		response_time: 42,
	};

	const fastPolling = { max_wait_ms: 60_000, poll_interval_ms: 1_000 };

	beforeEach(() => jest.useFakeTimers());
	afterEach(() => jest.useRealTimers());

	// The handler sleeps poll_interval_ms between status checks. Driving fake
	// timers lets these run at the real minimum interval without the wait.
	async function runResearch(input: TavilyResearchRequest) {
		let settled = false;
		const outcome = Tavily.research(ctx, input).then(
			(value) => {
				settled = true;
				return { ok: true as const, value };
			},
			(error: unknown) => {
				settled = true;
				return { ok: false as const, error };
			},
		);

		for (let tick = 0; !settled && tick < 50; tick++) {
			await jest.advanceTimersByTimeAsync(fastPolling.poll_interval_ms);
		}

		const settledOutcome = await outcome;
		if (!settledOutcome.ok) throw settledOutcome.error;
		return settledOutcome.value;
	}

	it('queues the task without leaking polling controls into the body', async () => {
		mockedRequest.mockResolvedValueOnce(completed);

		await runResearch({
			input: 'state of MCP adoption',
			model: 'pro',
			...fastPolling,
		});

		expect(mockedRequest).toHaveBeenCalledWith('research', ctx.key, {
			method: 'POST',
			body: {
				input: 'state of MCP adoption',
				model: 'pro',
				stream: false,
			},
		});
	});

	it('polls the task until it completes', async () => {
		mockedRequest
			.mockResolvedValueOnce(queued)
			.mockResolvedValueOnce({ ...queued, status: 'in_progress' })
			.mockResolvedValueOnce(completed);

		const result = await runResearch({
			input: 'state of MCP adoption',
			...fastPolling,
		});

		expect(mockedRequest).toHaveBeenCalledTimes(3);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'research/req-123',
			ctx.key,
			{
				method: 'GET',
			},
		);
		expect(result.status).toBe('completed');
		expect(result.content).toBe('MCP adoption is growing.');
	});

	it('backfills fields the status polls omit', async () => {
		mockedRequest
			.mockResolvedValueOnce(queued)
			.mockResolvedValueOnce(completed);

		const result = await runResearch({
			input: 'state of MCP adoption',
			...fastPolling,
		});

		expect(result.request_id).toBe('req-123');
		expect(result.input).toBe('state of MCP adoption');
		expect(result.model).toBe('auto');
		expect(result.created_at).toBe('2026-08-22T12:00:00Z');
	});

	it('does not poll when the create call already completed', async () => {
		mockedRequest.mockResolvedValueOnce(completed);

		await runResearch({ input: 'x', ...fastPolling });

		expect(mockedRequest).toHaveBeenCalledTimes(1);
	});

	it('stops at the wait deadline and returns the last known status', async () => {
		mockedRequest.mockResolvedValueOnce(queued);

		const result = await runResearch({
			input: 'state of MCP adoption',
			max_wait_ms: 0,
			poll_interval_ms: 1_000,
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(result.status).toBe('pending');
		expect(upserts.researchResults).not.toHaveBeenCalled();
	});

	it('persists a completed report keyed by request id', async () => {
		mockedRequest.mockResolvedValueOnce(completed);

		await runResearch({
			input: 'state of MCP adoption',
			...fastPolling,
		});

		expect(upserts.researchResults).toHaveBeenCalledWith(
			'req-123',
			expect.objectContaining({
				requestId: 'req-123',
				input: 'state of MCP adoption',
				status: 'completed',
				content: 'MCP adoption is growing.',
				sources: [{ title: 'Spec', url: 'https://modelcontextprotocol.io' }],
				researchedAt: expect.any(Date),
			}),
		);
	});

	it('serialises structured content before persisting it', async () => {
		mockedRequest.mockResolvedValueOnce({
			...completed,
			content: { summary: 'growing', confidence: 0.9 },
		} satisfies TavilyResearchResponse);

		await runResearch({ input: 'x', ...fastPolling });

		const [, row] = upserts.researchResults.mock.calls[0] ?? [];
		expect(row?.content).toBe('{"summary":"growing","confidence":0.9}');
	});

	it('stores null content when the report is empty', async () => {
		mockedRequest.mockResolvedValueOnce({
			...completed,
			content: null,
		} satisfies TavilyResearchResponse);

		await runResearch({ input: 'x', ...fastPolling });

		const [, row] = upserts.researchResults.mock.calls[0] ?? [];
		expect(row?.content).toBeNull();
	});

	it('does not persist a failed task', async () => {
		mockedRequest.mockResolvedValueOnce(queued).mockResolvedValueOnce({
			request_id: 'req-123',
			status: 'failed',
			response_time: 3,
		} satisfies TavilyResearchResponse);

		const result = await runResearch({
			input: 'x',
			...fastPolling,
		});

		expect(result.status).toBe('failed');
		expect(upserts.researchResults).not.toHaveBeenCalled();
	});

	it('still returns the report when persistence fails', async () => {
		mockedRequest.mockResolvedValueOnce(completed);
		upserts.researchResults.mockRejectedValue(new Error('db offline'));

		const result = await runResearch({
			input: 'x',
			...fastPolling,
		});

		expect(result.status).toBe('completed');
		expect(warnSpy).toHaveBeenCalledTimes(1);
	});

	it('propagates an error raised while polling', async () => {
		mockedRequest
			.mockResolvedValueOnce(queued)
			.mockRejectedValueOnce(new Error('Too Many Requests'));

		await expect(runResearch({ input: 'x', ...fastPolling })).rejects.toThrow(
			'Too Many Requests',
		);
	});
});
