import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	COMPANYENRICH_API_BASE,
	compactQuery,
	makeCompanyEnrichRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v2/me' },
		{
			url: 'https://api.companyenrich.com/v2/me',
			ok: false,
			status,
			statusText: message,
			body: { title: message, status },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('makeCompanyEnrichRequest', () => {
	it('uses the v2 base URL and Authorization: Bearer header', async () => {
		mockedRequest.mockResolvedValue({ userId: 'test-user' });

		await makeCompanyEnrichRequest('/v2/me', 'test-api-key', {
			method: 'GET',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: COMPANYENRICH_API_BASE,
			VERSION: '2.0.0',
			HEADERS: {
				Authorization: 'Bearer test-api-key',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'GET', url: '/v2/me' }),
		);
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				headerNames: { retryAfter: 'retry-after' },
			},
		});
	});

	it('sends a validated POST body and preserves query parameters', async () => {
		mockedRequest.mockResolvedValue({ items: [] });

		await makeCompanyEnrichRequest('/v2/companies/search', 'test-api-key', {
			method: 'POST',
			body: { filter: { domain: 'example.com' } },
			query: { expand: ['financial', 'keywords'] },
		});

		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/v2/companies/search',
				body: { filter: { domain: 'example.com' } },
				query: { expand: ['financial', 'keywords'] },
			}),
		);
	});

	it('omits undefined query values', () => {
		expect(compactQuery({ domain: 'example.com', expand: undefined })).toEqual({
			domain: 'example.com',
		});
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		await expect(makeCompanyEnrichRequest('/v2/me', '')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 2500);
		mockedRequest.mockRejectedValue(rateLimited);

		await expect(
			makeCompanyEnrichRequest('/v2/me', 'test-api-key'),
		).rejects.toBe(rateLimited);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 2500 });
	});
});
