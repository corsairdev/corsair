import { AuthMissingError } from 'corsair/core';
import type { OpenAPIConfig, RateLimitConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { ENDORSAL_API_BASE, makeEndorsalRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function makeApiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{
			method: 'POST',
			url: '/v1/contacts',
			body: { email: 'private@example.com', phone: '+14172618261' },
		},
		{
			url: `${ENDORSAL_API_BASE}/v1/contacts`,
			ok: false,
			status,
			statusText: 'Request failed',
			body: { email: 'private@example.com', message: 'Provider detail' },
		},
		'Request failed',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('makeEndorsalRequest', () => {
	it('uses the official host and Bearer header without putting the key in TOKEN', async () => {
		mockedRequest.mockResolvedValue({ success: true });
		await makeEndorsalRequest('/v1/contacts', 'test-key', {
			method: 'POST',
			body: { email: 'jane@example.com' },
			query: { campaignID: 'campaign_123' },
		});
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: ENDORSAL_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-key',
				'Content-Type': 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/v1/contacts',
				body: { email: 'jane@example.com' },
				query: { campaignID: 'campaign_123' },
			}),
		);
	});

	it('allows a keyless GET request and omits Authorization', async () => {
		mockedRequest.mockResolvedValue({ success: true, data: [] });
		await makeEndorsalRequest('/v1/testimonials', undefined);
		expect(mockedRequest.mock.calls[0]?.[0]?.BASE).toBe(ENDORSAL_API_BASE);
		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('rejects write requests with a missing or empty key before transport', async () => {
		await expect(
			makeEndorsalRequest('/v1/testimonials', '', { method: 'POST' }),
		).rejects.toThrow(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('redacts PII from propagated errors while preserving status and retry metadata', async () => {
		mockedRequest.mockRejectedValue(makeApiError(429, 4000));
		// `unknown` because a rejected promise may produce any value; the checks narrow it.
		const result = await makeEndorsalRequest('/v1/contacts', 'test-key', {
			method: 'POST',
			body: { email: 'private@example.com' },
		}).catch((caught: unknown) => caught);
		expect(result).toBeInstanceOf(ApiError);
		if (!(result instanceof ApiError)) throw new Error('Expected ApiError');
		expect(result.status).toBe(429);
		expect(result.retryAfter).toBe(4000);
		expect(result.body).toEqual({ redacted: true });
		expect(result.request.body).toEqual({ redacted: true });
		expect(result.message).not.toContain('private@example.com');
	});

	it('configures the transport to extract Retry-After without retrying writes', async () => {
		mockedRequest.mockResolvedValue({ success: true });
		await makeEndorsalRequest('/v1/testimonials', 'test-key', {
			method: 'POST',
			body: { name: 'Jane Doe' },
		});
		expect(mockedRequest.mock.calls[0]?.[2]?.rateLimitConfig).toMatchObject({
			enabled: true,
			maxRetries: 0,
			headerNames: { retryAfter: 'retry-after' },
		});
	});

	it('extracts Retry-After from an actual transport 429 response', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'rate limited' }), {
				status: 429,
				headers: { 'content-type': 'application/json', 'retry-after': '4' },
			}),
		);
		const config: OpenAPIConfig = {
			BASE: ENDORSAL_API_BASE,
			VERSION: '1.0',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
		};
		const rateLimitConfig: RateLimitConfig = {
			enabled: true,
			maxRetries: 0,
			initialRetryDelay: 0,
			backoffMultiplier: 1,
			headerNames: { retryAfter: 'retry-after' },
		};
		try {
			// `unknown` because the transport rejects with its declared runtime error type.
			const failure = await actualHttp
				.request(
					config,
					{ method: 'GET', url: '/v1/testimonials' },
					{ rateLimitConfig },
				)
				.catch((caught: unknown) => caught);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(failure).toBeInstanceOf(ApiError);
			if (!(failure instanceof ApiError)) throw new Error('Expected ApiError');
			expect(failure.status).toBe(429);
			expect(failure.retryAfter).toBe(4000);
		} finally {
			fetchMock.mockRestore();
		}
	});
});
