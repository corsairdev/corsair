import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	JUNGLESCOUT_API_BASE,
	JUNGLESCOUT_RATE_LIMIT_CONFIG,
	JungleScoutAPIError,
	makeJungleScoutRequest,
	parseJungleScoutResponse,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeJungleScoutRequest', () => {
	it('sends correct Jungle Scout headers including Authorization and X-API-Type', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeJungleScoutRequest(
			'/api/keywords/keywords_by_asin_query',
			'my-key-name:secret-key-123',
			{
				method: 'POST',
				body: { data: { type: 'keywords_by_asin_query' } },
				query: { marketplace: 'us' },
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: JUNGLESCOUT_API_BASE,
			HEADERS: {
				Authorization: 'my-key-name:secret-key-123',
				Accept: 'application/vnd.junglescout.v1+json',
				'Content-Type': 'application/vnd.api+json',
				'X-API-Type': 'junglescout',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/api/keywords/keywords_by_asin_query',
				body: { data: { type: 'keywords_by_asin_query' } },
				mediaType: 'application/vnd.api+json',
				query: { marketplace: 'us' },
			}),
		);
		expect(mockRequest.mock.calls[0]?.[2]).toEqual({
			rateLimitConfig: JUNGLESCOUT_RATE_LIMIT_CONFIG,
		});
	});

	it('supports cobalt apiType header when specified', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeJungleScoutRequest(
			'/api/keywords/keywords_by_asin_query',
			'cobalt-key-name:cobalt-api-key',
			{
				method: 'POST',
				apiType: 'cobalt',
			},
		);

		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toMatchObject({
			'X-API-Type': 'cobalt',
			Authorization: 'cobalt-key-name:cobalt-api-key',
		});
	});

	it('throws AuthMissingError for a missing, empty, or whitespace key', async () => {
		await expect(
			makeJungleScoutRequest('/api/share_of_voice', undefined, {
				method: 'GET',
			}),
		).rejects.toThrow(AuthMissingError);

		await expect(
			makeJungleScoutRequest('/api/keywords/keywords_by_asin_query', '', {
				method: 'POST',
			}),
		).rejects.toThrow(AuthMissingError);

		await expect(
			makeJungleScoutRequest('/api/keywords/keywords_by_asin_query', '   ', {
				method: 'POST',
			}),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('preserves status and Retry-After while removing inputs and provider payloads', async () => {
		const privateTerm = 'customer-private-search-phrase';
		const echoedError = new ApiError(
			{
				method: 'POST',
				url: '/api/keywords/keywords_by_keyword_query',
				query: { marketplace: 'us', keyword: privateTerm },
				body: { data: { attributes: { search_terms: [privateTerm] } } },
			},
			{
				url: `https://developer.junglescout.com/api/keywords/keywords_by_keyword_query?keyword=${privateTerm}`,
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { errors: [{ detail: `Rejected ${privateTerm}` }] },
			},
			`Rejected ${privateTerm}`,
			{ retryAfter: 4000 },
		);
		mockRequest.mockRejectedValue(echoedError);

		// `unknown` because a rejected request can throw a non-Error value.
		const error = await makeJungleScoutRequest(
			'/api/keywords/keywords_by_asin_query',
			'test-key-name:test-api-key',
			{ method: 'POST' },
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw new Error('Expected ApiError');
		expect(error).not.toBe(echoedError);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(4000);
		expect(error.request).toEqual({
			method: 'POST',
			url: '/api/keywords/keywords_by_asin_query',
		});
		expect(error.body).toEqual({});
		expect(error.message).not.toContain(privateTerm);
		expect(error.url).not.toContain(privateTerm);
		expect(JSON.stringify(error)).not.toContain(privateTerm);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 4000,
		});
	});

	it('sanitizes non-ApiError failures before propagating them', async () => {
		mockRequest.mockRejectedValue(new Error('failed for private-search-value'));

		// `unknown` because a rejected request can throw a non-Error value.
		const error = await makeJungleScoutRequest(
			'/api/share_of_voice',
			'test-key-name:test-api-key',
			{ method: 'GET' },
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(JungleScoutAPIError);
		expect(error).toMatchObject({
			name: 'JungleScoutAPIError',
			message: 'Jungle Scout request failed',
		});
		expect(error).not.toHaveProperty('cause');
		expect(JSON.stringify(error)).not.toContain('private-search-value');
	});

	it('verifies real transport rateLimitConfig with Retry-After extraction', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');

		expect(JUNGLESCOUT_RATE_LIMIT_CONFIG.enabled).toBe(true);
		expect(JUNGLESCOUT_RATE_LIMIT_CONFIG.maxRetries).toBe(0);
		expect(JUNGLESCOUT_RATE_LIMIT_CONFIG.headerNames?.retryAfter).toBe(
			'retry-after',
		);

		const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({ errors: [{ code: 'REQUEST_THROTTLED' }] }),
				{
					status: 429,
					statusText: 'Too Many Requests',
					headers: {
						'content-type': 'application/json',
						'retry-after': '4',
					},
				},
			),
		);

		try {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			// `unknown` because a rejected request can throw a non-Error value.
			const err: unknown = await actualHttp
				.request(
					{
						BASE: JUNGLESCOUT_API_BASE,
						VERSION: '1.0.0',
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
						HEADERS: {
							Accept: 'application/vnd.junglescout.v1+json',
							'Content-Type': 'application/vnd.api+json',
						},
					},
					{
						method: 'GET',
						url: '/api/share_of_voice',
					},
					{
						rateLimitConfig: JUNGLESCOUT_RATE_LIMIT_CONFIG,
					},
				)
				// `unknown` because a caught rejection value has no static type before runtime assertion.
				.catch((caught: unknown) => caught);

			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(err).toBeInstanceOf(ApiError);
			if (err instanceof ApiError) {
				expect(err.status).toBe(429);
				expect(err.retryAfter).toBe(4000);
			}
		} finally {
			fetchMock.mockRestore();
		}
	});

	it('decodes successful vendor JSON responses returned as text by core transport', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const payload = {
			data: {
				id: 'us/coffee',
				type: 'share_of_voice',
				attributes: { estimated_30_day_search_volume: 25 },
			},
		};
		const fetchMock = jest.spyOn(global, 'fetch');
		const vendorTypes = [
			'application/vnd.junglescout.v1+json',
			'application/vnd.api+json',
		];

		try {
			for (const contentType of vendorTypes) {
				fetchMock.mockResolvedValueOnce(
					new Response(JSON.stringify(payload), {
						status: 200,
						headers: { 'content-type': contentType },
					}),
				);
				const rawResponse = await actualHttp.request(
					{
						BASE: JUNGLESCOUT_API_BASE,
						VERSION: '1.0.0',
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
						HEADERS: {
							Accept: 'application/vnd.junglescout.v1+json',
							'Content-Type': 'application/vnd.api+json',
						},
					},
					{ method: 'GET', url: '/api/share_of_voice' },
				);

				expect(rawResponse).toBe(JSON.stringify(payload));
				expect(parseJungleScoutResponse(rawResponse)).toEqual(payload);
			}
			expect(fetchMock).toHaveBeenCalledTimes(vendorTypes.length);
		} finally {
			fetchMock.mockRestore();
		}
	});
});
