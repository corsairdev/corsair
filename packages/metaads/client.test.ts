import { AuthMissingError } from 'corsair/core';
import type { OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	METAADS_API_BASE,
	METAADS_API_VERSION,
	makeMetaAdsRequest,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

beforeEach(() => mockedRequest.mockReset());

describe('Meta Ads Graph API client', () => {
	it('uses the pinned Graph API version and sends token as documented query parameter', async () => {
		mockedRequest.mockResolvedValue({ id: '100' });
		await makeMetaAdsRequest('/me/adaccounts', 'safe-test-token', {
			method: 'GET',
			query: { fields: 'id,name', limit: 1 },
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		const [config, options, retryOptions] = mockedRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: METAADS_API_BASE,
			VERSION: METAADS_API_VERSION,
			WITH_CREDENTIALS: false,
		});
		expect(options).toMatchObject({
			method: 'GET',
			url: '/v27.0/me/adaccounts',
			query: { fields: 'id,name', limit: 1, access_token: 'safe-test-token' },
		});
		expect(JSON.stringify(config)).not.toContain('safe-test-token');
		expect(retryOptions).toMatchObject({
			rateLimitConfig: { enabled: true, maxRetries: 0 },
		});
	});

	it('encodes POST payload as form fields and passes a documented idempotency key header', async () => {
		mockedRequest.mockResolvedValue({ id: 'created-id' });
		await makeMetaAdsRequest('/act_1/campaigns', 'safe-test-token', {
			method: 'POST',
			body: { name: 'Test', special_ad_categories: [] },
			idempotencyKey: 'key-123',
		});

		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/v27.0/act_1/campaigns',
			formData: { name: 'Test', special_ad_categories: [] },
			query: { access_token: 'safe-test-token' },
			headers: { 'X-Client-Idempotent-Key': 'key-123' },
		});
	});

	it('fails fast for a missing or empty OAuth token', async () => {
		await expect(
			makeMetaAdsRequest('/me/adaccounts', undefined),
		).rejects.toThrow(AuthMissingError);
		await expect(makeMetaAdsRequest('/me/adaccounts', '')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('preserves the core ApiError status and retry metadata', async () => {
		const rateLimit = new ApiError(
			{ method: 'GET', url: '/act_1/campaigns' },
			{
				url: 'https://graph.facebook.com/v27.0/act_1/campaigns',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: { message: 'Rate limited' } },
			},
			'Rate limited',
			{ retryAfter: 4000 },
		);
		mockedRequest.mockRejectedValue(rateLimit);
		await expect(
			makeMetaAdsRequest('/act_1/campaigns', 'safe-test-token'),
		).rejects.toBe(rateLimit);
		expect(rateLimit.status).toBe(429);
		expect(rateLimit.retryAfter).toBe(4000);
	});

	it('real transport extracts Retry-After without retrying a Meta throttle', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ error: { message: 'Throttled' } }), {
				status: 429,
				headers: { 'content-type': 'application/json', 'retry-after': '4' },
			}),
		);
		const config: OpenAPIConfig = {
			BASE: METAADS_API_BASE,
			VERSION: METAADS_API_VERSION,
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
		};
		// `unknown` because rejected transport values are untyped until checked as ApiError.
		const result = await actualHttp
			.request(
				config,
				{
					method: 'GET',
					url: '/v27.0/me/adaccounts',
					query: { access_token: 'safe-test-token' },
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
			.catch((caught: unknown) => caught);

		expect(result).toBeInstanceOf(ApiError);
		if (!(result instanceof ApiError))
			throw new Error('Expected ApiError from the real transport');
		expect(result.status).toBe(429);
		expect(result.retryAfter).toBe(4000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		fetchMock.mockRestore();
	});
});
