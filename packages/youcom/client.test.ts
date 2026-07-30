import { ApiError, request } from 'corsair/http';
import * as client from './client';
import { makeYoucomSearchRequest, YoucomAPIError } from './client';
import { youSearch } from './endpoints/yousearch';
import { errorHandlers } from './error-handlers';
import type { YoucomContext } from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

const sampleResponse = {
	results: { web: [], news: [] },
	metadata: {
		search_uuid: '942ccbdd-7705-4d9c-9d37-4ef386658e90',
		query: 'test',
		latency: 0.5,
	},
};

const upsertByEntityId = jest.fn();

const mockCtx = {
	key: 'test-key',
	db: {
		searchResults: {
			upsertByEntityId,
		},
	},
} as unknown as YoucomContext;

function lastCall() {
	const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
	return { config: call?.[0], options: call?.[1] };
}

describe('youSearch endpoint validation', () => {
	let searchSpy: jest.SpiedFunction<typeof client.makeYoucomSearchRequest>;

	beforeEach(() => {
		searchSpy = jest
			.spyOn(client, 'makeYoucomSearchRequest')
			.mockResolvedValue(sampleResponse);
		upsertByEntityId.mockReset();
	});

	afterEach(() => {
		searchSpy.mockRestore();
	});

	it('rejects invalid input before calling the provider', async () => {
		await expect(
			youSearch(mockCtx, { query: 'test', offset: 99 }),
		).rejects.toThrow();
		expect(searchSpy).not.toHaveBeenCalled();
	});

	it('applies schema defaults before calling the provider', async () => {
		await youSearch(mockCtx, { query: 'test' });

		expect(searchSpy).toHaveBeenCalledWith(
			'test-key',
			expect.objectContaining({
				query: 'test',
				count: 10,
				offset: 0,
				language: 'EN',
				safesearch: 'moderate',
				livecrawl_formats: ['html'],
			}),
		);
	});
});

describe('makeYoucomSearchRequest routing', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(sampleResponse);
	});

	it('sends freshness via GET query', async () => {
		await makeYoucomSearchRequest('test-key', {
			query: 'technology news',
			freshness: 'week',
		});

		const { config, options } = lastCall();
		expect(options.method).toBe('GET');
		expect(options.url).toBe('/v1/search');
		expect(config.HEADERS['X-API-Key']).toBe('test-key');
		expect(options.query).toMatchObject({
			query: 'technology news',
			freshness: 'week',
		});
	});

	it('sends country and language via GET query', async () => {
		await makeYoucomSearchRequest('test-key', {
			query: 'local news headlines',
			country: 'US',
			language: 'EN',
		});

		const { options } = lastCall();
		expect(options.method).toBe('GET');
		expect(options.query).toMatchObject({
			query: 'local news headlines',
			country: 'US',
			language: 'EN',
		});
	});

	it('sends safesearch and offset via GET query', async () => {
		await makeYoucomSearchRequest('test-key', {
			query: 'open source software releases',
			count: 2,
			offset: 0,
			safesearch: 'moderate',
		});

		const { options } = lastCall();
		expect(options.method).toBe('GET');
		expect(options.query).toMatchObject({
			query: 'open source software releases',
			count: 2,
			offset: 0,
			safesearch: 'moderate',
		});
	});

	it('sends boost_domains via POST body', async () => {
		await makeYoucomSearchRequest('test-key', {
			query: 'TypeScript best practices',
			boost_domains: ['typescriptlang.org', 'github.com'],
		});

		const { options } = lastCall();
		expect(options.method).toBe('POST');
		expect(options.body).toMatchObject({
			query: 'TypeScript best practices',
			boost_domains: ['typescriptlang.org', 'github.com'],
		});
	});

	it('sends exclude_domains via POST body', async () => {
		await makeYoucomSearchRequest('test-key', {
			query: 'machine learning tutorials',
			exclude_domains: ['reddit.com', 'quora.com'],
		});

		const { options } = lastCall();
		expect(options.method).toBe('POST');
		expect(options.body).toMatchObject({
			query: 'machine learning tutorials',
			exclude_domains: ['reddit.com', 'quora.com'],
		});
	});

	it('sends include_domains via POST body', async () => {
		await makeYoucomSearchRequest('test-key', {
			query: 'software engineering',
			include_domains: ['github.com', 'stackoverflow.com'],
		});

		const { options } = lastCall();
		expect(options.method).toBe('POST');
		expect(options.body).toMatchObject({
			query: 'software engineering',
			include_domains: ['github.com', 'stackoverflow.com'],
		});
	});

	it('does not enable transport-level rate-limit retries', async () => {
		await makeYoucomSearchRequest('test-key', { query: 'test' });

		expect(mockRequest.mock.calls[0]?.[2]).toBeUndefined();
	});
});

describe('YoucomAPIError error handlers', () => {
	it('matches 429 from wrapped YoucomAPIError and preserves retryAfter', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/v1/search' },
			{
				url: 'https://ydc-index.io/v1/search',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 5000 },
		);
		const error = new YoucomAPIError(apiError.message, '429', {
			cause: apiError,
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 5000,
		});
	});

	it('matches 401 and 403 from wrapped YoucomAPIError', () => {
		const authError = new YoucomAPIError('Unauthorized', '401');
		const permissionError = new YoucomAPIError('Forbidden', '403');

		expect(errorHandlers.AUTH_ERROR.match(authError)).toBe(true);
		expect(errorHandlers.PERMISSION_ERROR.match(permissionError)).toBe(true);
	});
});
