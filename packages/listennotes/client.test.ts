import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	compactQuery,
	LISTENNOTES_API_BASE,
	makeListennotesRequest,
	sanitizeApiError,
	serializeFormBody,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{
			method: 'GET',
			url: '/genres',
			headers: { 'x-listenapi-key': 'secret-test-key' },
		},
		{
			url: 'https://listen-api.listennotes.com/api/v2/genres',
			ok: false,
			status,
			statusText: message,
			body: { error: message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('makeListennotesRequest', () => {
	it('uses the v2 base URL and X-ListenAPI-Key header', async () => {
		mockedRequest.mockResolvedValue({ genres: [] });

		await makeListennotesRequest('/genres', 'test-api-key', {
			method: 'GET',
			query: { top_level_only: 1 },
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: LISTENNOTES_API_BASE,
			VERSION: '2.0.0',
			HEADERS: {
				'X-ListenAPI-Key': 'test-api-key',
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/genres',
				query: { top_level_only: 1 },
			}),
		);
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				headerNames: { retryAfter: 'retry-after' },
			},
		});
	});

	it('makes unauthenticated requests when apiKey is undefined', async () => {
		mockedRequest.mockResolvedValue({ genres: [] });

		await makeListennotesRequest('/genres', undefined, {
			method: 'GET',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'X-ListenAPI-Key',
		);
	});

	it('throws AuthMissingError for an explicitly empty key without sending a request', async () => {
		await expect(makeListennotesRequest('/genres', '')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('omits undefined query values via compactQuery', () => {
		expect(
			compactQuery({ q: 'podcasts', page: undefined, safe_mode: 1 }),
		).toEqual({
			q: 'podcasts',
			safe_mode: 1,
		});
	});

	it('rethrows sanitized 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 2500);
		mockedRequest.mockRejectedValue(rateLimited);

		// `unknown` because rejection value has no static type before caught.
		const caught: unknown = await makeListennotesRequest(
			'/genres',
			'test-api-key',
		).catch(
			// `unknown` because catch clause error is untyped.
			(e: unknown) => e,
		);

		expect(caught).toBe(rateLimited);
		if (!(caught instanceof ApiError)) throw new Error('Expected ApiError');
		const error = caught;
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2500);
		expect(error.request.headers?.['x-listenapi-key']).toBe('[REDACTED]');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: 2500 });
	});

	it('serializes form fields using standard URL encoding', () => {
		expect(
			serializeFormBody({
				ids: 'episode1,episode2',
				show_latest_episodes: 1,
				next_episode_pub_date: undefined,
			}),
		).toBe('ids=episode1%2Cepisode2&show_latest_episodes=1');
	});

	it('passes URL-encoded bodies and their media type to the transport', async () => {
		mockedRequest.mockResolvedValue({ podcasts: [] });
		await makeListennotesRequest('/podcasts', 'test-api-key', {
			method: 'POST',
			body: 'ids=episode1%2Cepisode2',
			mediaType: 'application/x-www-form-urlencoded',
		});
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/podcasts',
			body: 'ids=episode1%2Cepisode2',
			mediaType: 'application/x-www-form-urlencoded',
		});
	});

	it('sanitizes credentials from error request headers and body', () => {
		const raw = new ApiError(
			{
				method: 'POST',
				url: '/search_episode_titles',
				headers: { 'x-listenapi-key': 'super-secret-key' },
				query: {
					q: 'listener@example.com',
					podcast_id: 'https://owner@example.com/feed?token=private',
					genre_ids: '68',
				},
				body: { apiKey: 'secret', safe: 'value' },
			},
			{
				url: 'https://listen-api.listennotes.com/api/v2/search_episode_titles?q=listener%40example.com&podcast_id=https%3A%2F%2Fowner%40example.com%2Ffeed%3Ftoken%3Dprivate',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {
					token: 'secret-token',
					message:
						'Invalid query listener@example.com for https://owner@example.com/feed?token=private',
				},
			},
			'Too Many Requests for listener@example.com and https://owner@example.com/feed?token=private',
			{ retryAfter: 2500 },
		);

		// `unknown` because sanitizeApiError accepts and returns unknown for non-ApiError fallback.
		const sanitized: unknown = sanitizeApiError(raw);
		expect(sanitized).toBe(raw);
		if (!(sanitized instanceof ApiError)) throw new Error('Expected ApiError');
		expect(sanitized.request.headers?.['x-listenapi-key']).toBe('[REDACTED]');
		expect(sanitized.request.query?.q).toBe('[REDACTED]');
		expect(sanitized.request.query?.podcast_id).toBe('[REDACTED]');
		expect(sanitized.request.query?.genre_ids).toBe('68');
		expect(sanitized.request.body).toBe('[REDACTED]');
		expect(sanitized.url).toContain('q=%5BREDACTED%5D');
		expect(sanitized.url).toContain('podcast_id=%5BREDACTED%5D');
		expect(sanitized.message).not.toContain('listener@example.com');
		expect(sanitized.message).not.toContain('owner@example.com');
		expect(sanitized.status).toBe(429);
		expect(sanitized.retryAfter).toBe(2500);
		expect(sanitized.body).toEqual({
			token: '[REDACTED]',
			message: 'Invalid query [REDACTED] for [REDACTED]',
		});
	});

	it('keeps the original request query while redacting sensitive diagnostics', async () => {
		mockedRequest.mockResolvedValue({ terms: [] });
		const podcastId = 'https://owner@example.com/feed?token=private';
		await makeListennotesRequest('/search_episode_titles', 'test-api-key', {
			method: 'GET',
			query: { q: 'listener@example.com', podcast_id: podcastId },
		});
		expect(mockedRequest.mock.calls[0]?.[1]?.query).toEqual({
			q: 'listener@example.com',
			podcast_id: podcastId,
		});
	});

	it('redacts publisher domains from propagated API error diagnostics', () => {
		const raw = new ApiError(
			{ method: 'GET', url: '/podcasts/domains/private.publisher.example' },
			{
				url: 'https://listen-api.listennotes.com/api/v2/podcasts/domains/private.publisher.example',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: { message: 'No podcasts for private.publisher.example' },
			},
			'No podcasts for private.publisher.example',
		);

		const sanitized = sanitizeApiError(raw);
		if (!(sanitized instanceof ApiError)) throw new Error('Expected ApiError');
		expect(sanitized.request.url).not.toContain('private.publisher.example');
		expect(sanitized.url).not.toContain('private.publisher.example');
		expect(sanitized.message).not.toContain('private.publisher.example');
		expect(sanitized.body).toEqual({ message: 'No podcasts for [REDACTED]' });
	});
});

describe('real transport rate-limit test via jest.requireActual', () => {
	it('uses real transport with 429 and parses Retry-After header', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');

		const originalFetch = globalThis.fetch;
		try {
			globalThis.fetch = jest.fn().mockImplementation(() =>
				Promise.resolve({
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					headers: new Headers({
						'retry-after': '4',
						'content-type': 'application/json',
					}),
					json: () => Promise.resolve({ error: 'Too Many Requests' }),
					text: () =>
						Promise.resolve(JSON.stringify({ error: 'Too Many Requests' })),
					clone() {
						return this;
					},
				}),
			);

			// `unknown` because rejection value has no static type before caught.
			const caught: unknown = await actualHttp
				.request(
					{
						BASE: LISTENNOTES_API_BASE,
						VERSION: '2.0.0',
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
						HEADERS: {},
					},
					{
						method: 'GET',
						url: '/genres',
					},
					{
						rateLimitConfig: {
							enabled: true,
							maxRetries: 0,
							initialRetryDelay: 0,
							backoffMultiplier: 1,
							headerNames: { retryAfter: 'retry-after' },
						},
					},
				)
				.catch(
					// `unknown` because catch clause parameter has no static type.
					(e: unknown) => e,
				);

			expect(caught).toBeInstanceOf(ApiError);
			if (!(caught instanceof ApiError)) throw new Error('Expected ApiError');
			const error = caught;
			expect(error.status).toBe(429);
			expect(error.retryAfter).toBe(4000);
			expect(globalThis.fetch).toHaveBeenCalledTimes(1);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
