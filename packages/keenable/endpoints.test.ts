import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Fetch, Search } from './endpoints';
import type { KeenableContext } from './index';
import { keenable, keenableEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeKeenableRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeKeenableRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Search.post>[0];

function buildCtx(): Ctx {
	const ctx: KeenableContext = {
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

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

// Fixtures mirror the canonical OpenAPI spec shapes for POST /v1/search and
// GET /v1/fetch (docs /api-reference/search, /fetch).

describe('search.post', () => {
	it('sends the validated body and returns the parsed response', async () => {
		const mockResponse = {
			query: 'keenable',
			mode: 'pro',
			results: [
				{
					title: 'Keenable — web search for AI agents',
					url: 'https://keenable.ai',
					description: 'Web search and page fetching API.',
					snippet: 'Keenable provides realtime and deep web search...',
					published_at: '2026-01-15T10:30:00Z',
					acquired_at: '2026-01-16T08:12:34Z',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Search.post(ctx, {
			query: 'keenable',
			max_results: 5,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/v1/search', 'test-api-key', {
			method: 'POST',
			body: { query: 'keenable', max_results: 5 },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'keenable.search',
			{ query: 'keenable', resultCount: 1 },
			'completed',
		);
	});

	it('rejects invalid input before calling the API', async () => {
		await expect(Search.post(ctx, { query: '' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});

	it('rejects a response missing required results', async () => {
		mockedRequest.mockResolvedValue({ query: 'keenable', mode: 'pro' });

		await expect(Search.post(ctx, { query: 'keenable' })).rejects.toThrow();

		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('fetch.get', () => {
	it('sends url, max_chars, live and prompt as query params', async () => {
		const mockResponse = {
			url: 'https://example.com',
			title: 'Example Domain',
			description: 'Example page',
			author: 'Jane Doe',
			published_at: 1768435200,
			content: '# Example Domain\n\nThis domain is for use in examples...',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Fetch.get(ctx, {
			url: 'https://example.com',
			max_chars: 2000,
			live: true,
			prompt: 'Summarize the page',
		});

		expect(result).toEqual(mockResponse);
		expect(result.published_at).toBe(1768435200);
		expect(mockedRequest).toHaveBeenCalledWith('/v1/fetch', 'test-api-key', {
			method: 'GET',
			query: {
				url: 'https://example.com',
				max_chars: 2000,
				live: true,
				prompt: 'Summarize the page',
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'keenable.fetch',
			{ url: 'https://example.com' },
			'completed',
		);
	});

	it('omits absent optional params from the query', async () => {
		mockedRequest.mockResolvedValue({
			url: 'https://example.com',
			content: 'x',
		});

		await Fetch.get(ctx, { url: 'https://example.com' });

		expect(mockedRequest).toHaveBeenCalledWith('/v1/fetch', 'test-api-key', {
			method: 'GET',
			query: {
				url: 'https://example.com',
				max_chars: undefined,
				live: undefined,
				prompt: undefined,
			},
		});
	});

	it('rejects a malformed url before calling the API', async () => {
		await expect(Fetch.get(ctx, { url: 'not a url' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});

	it('rejects a response missing required content', async () => {
		mockedRequest.mockResolvedValue({ url: 'https://example.com' });

		await expect(
			Fetch.get(ctx, { url: 'https://example.com' }),
		).rejects.toThrow();

		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('keenable plugin shape', () => {
	it('exposes search.post and fetch.get', () => {
		const plugin = keenable({});

		expect(plugin.endpoints?.search.post).toBeDefined();
		expect(plugin.endpoints?.fetch.get).toBeDefined();
	});

	it('uses api_key auth and declares no webhooks', () => {
		const plugin = keenable({ authType: 'api_key' });

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('wires zod input and output schemas for every endpoint', () => {
		expect(keenableEndpointSchemas['search.post']?.input).toBeDefined();
		expect(keenableEndpointSchemas['search.post']?.output).toBeDefined();
		expect(keenableEndpointSchemas['fetch.get']?.input).toBeDefined();
		expect(keenableEndpointSchemas['fetch.get']?.output).toBeDefined();
	});
});
