import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	MRSCRAPER_API_BASE,
	MRSCRAPER_PLATFORM_API_BASE,
	makeMrscraperRequest,
	tryGetStoredKey,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/scrapers-ai-rerun' },
		{
			url: 'https://api.app.mrscraper.com/api/v1/scrapers-ai-rerun',
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

describe('makeMrscraperRequest', () => {
	it('defaults to the platform base and sends the x-api-token header', async () => {
		mockRequest.mockResolvedValue({ data: { id: 'acc-1' } });

		await makeMrscraperRequest('/subscription-accounts', 'test-key-123', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: MRSCRAPER_PLATFORM_API_BASE,
			HEADERS: {
				'x-api-token': 'test-key-123',
				'Content-Type': 'application/json',
			},
		});
		// MrScraper must never fall back to a bearer Authorization header.
		expect(mockRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'GET', url: '/subscription-accounts' }),
		);
	});

	it('supports the Scraper API base with the token query param', async () => {
		mockRequest.mockResolvedValue('<html></html>');

		await makeMrscraperRequest('/', 'test-key-123', {
			method: 'GET',
			base: MRSCRAPER_API_BASE,
			includeTokenQuery: true,
			headers: { Accept: 'text/html' },
			query: { url: 'https://books.toscrape.com', html: true },
		});

		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: MRSCRAPER_API_BASE,
			HEADERS: {
				'x-api-token': 'test-key-123',
				Accept: 'text/html',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				query: {
					url: 'https://books.toscrape.com',
					html: true,
					token: 'test-key-123',
				},
			}),
		);
	});

	it('sends a JSON body only for write methods', async () => {
		mockRequest.mockResolvedValue({ data: { id: 'res-1' } });

		await makeMrscraperRequest('/scrapers-ai-rerun', 'key', {
			method: 'POST',
			body: { scraperId: 'id', url: 'https://books.toscrape.com' },
		});

		const options = mockRequest.mock.calls[0]?.[1];
		expect(options?.method).toBe('POST');
		expect(options?.body).toEqual({
			scraperId: 'id',
			url: 'https://books.toscrape.com',
		});
		expect(options?.mediaType).toBe('application/json; charset=utf-8');
	});

	it('disables the transport retry loop so error handlers own retries', async () => {
		mockRequest.mockResolvedValue({ data: { id: 'acc-1' } });

		await makeMrscraperRequest('/subscription-accounts', 'test-key-123', {
			method: 'GET',
		});

		expect(mockRequest.mock.calls[0]?.[2]).toEqual({
			rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
		});
		// There is no 5xx handler in this plugin, so a 503 must not be treated
		// as a rate limit: retrying a scrape POST could start another billed
		// scrape.
		const retryConfig = mockRequest.mock.calls[0]?.[2]?.rateLimitConfig;
		expect(retryConfig?.isRateLimitError?.(429, {})).toBe(true);
		expect(retryConfig?.isRateLimitError?.(503, {})).toBe(false);
		// The provider allows a per-request timeout of about 2000s, so the
		// transport deadline must not cut a supported long scrape off early.
		expect(mockRequest.mock.calls[0]?.[0]?.TIMEOUT).toBeGreaterThan(2_000_000);
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({});

		await expect(
			makeMrscraperRequest('/subscription-accounts', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 4000);
		mockRequest.mockRejectedValue(rateLimited);

		await expect(
			makeMrscraperRequest('/results', 'test-key', { method: 'GET' }),
		).rejects.toBe(rateLimited);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 4000,
		});
	});

	it('wraps non-Error rejections', async () => {
		mockRequest.mockRejectedValue('boom');

		await expect(
			makeMrscraperRequest('/results', 'test-key', { method: 'GET' }),
		).rejects.toThrow('Unknown error');
	});
});

describe('tryGetStoredKey', () => {
	it('returns the stored key when present', async () => {
		await expect(
			tryGetStoredKey(() => Promise.resolve('stored-key')),
		).resolves.toBe('stored-key');
	});

	it('resolves a nullish stored key to undefined', async () => {
		await expect(
			tryGetStoredKey(() => Promise.resolve(null)),
		).resolves.toBeUndefined();
	});

	it('treats a missing DEK as no stored key', async () => {
		await expect(
			tryGetStoredKey(() =>
				Promise.reject(new Error('No DEK found for account (tenant: "t")')),
			),
		).resolves.toBeUndefined();
	});

	it('propagates unrelated key-manager failures', async () => {
		await expect(
			tryGetStoredKey(() => Promise.reject(new Error('database unavailable'))),
		).rejects.toThrow('database unavailable');
	});
});
