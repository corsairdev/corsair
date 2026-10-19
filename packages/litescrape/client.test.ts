import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { LITESCRAPE_API_BASE, makeLitescrapeRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/api/google/search' },
		{
			url: 'https://api.litescrape.com/api/google/search',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeLitescrapeRequest', () => {
	it('sends Authorization: Bearer <apiKey> and the documented base URL', async () => {
		mockRequest.mockResolvedValue({ organic_results: [] });

		await makeLitescrapeRequest('/api/google/search', 'ls_live_test', {
			method: 'GET',
			query: { q: 'coffee' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: LITESCRAPE_API_BASE,
			HEADERS: {
				Authorization: 'Bearer ls_live_test',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/api/google/search',
				query: { q: 'coffee' },
			}),
		);
	});

	it('omits the request body for GET requests', async () => {
		mockRequest.mockResolvedValue({});

		await makeLitescrapeRequest('/api/keys/status', 'ls_live_test', {
			method: 'GET',
			body: { ignored: true },
		});

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'GET', body: undefined }),
		);
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({});

		await expect(
			makeLitescrapeRequest('/api/google/search', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 3000);
		mockRequest.mockRejectedValue(rateLimited);

		await expect(
			makeLitescrapeRequest('/api/google/search', 'ls_live_test', {
				method: 'GET',
			}),
		).rejects.toBe(rateLimited);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 3000,
		});
	});

	it('wraps only non-Error throwables in a LitescrapeAPIError', async () => {
		mockRequest.mockRejectedValue('boom');

		await expect(
			makeLitescrapeRequest('/api/google/search', 'ls_live_test', {
				method: 'GET',
			}),
		).rejects.toThrow('Unknown error');
	});
});
