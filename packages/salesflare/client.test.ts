import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { makeSalesflareRequest, SalesflareAPIError } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const requestMock = jest.mocked(request);

const apiRequest: ApiRequestOptions = { method: 'GET', url: '/tasks' };
const rateLimitResult: ApiResult = {
	url: 'https://api.salesflare.com/tasks',
	ok: false,
	status: 429,
	statusText: 'Too Many Requests',
	body: {},
};

describe('Salesflare client', () => {
	beforeEach(() => {
		requestMock.mockReset();
	});

	it('keeps the transport single-attempt so the error handler owns 429 retries', async () => {
		// A rate-limited response must surface after exactly one transport
		// attempt; the plugin error handler is the single retry owner.
		requestMock.mockRejectedValue(
			new ApiError(apiRequest, rateLimitResult, 'Too Many Requests', {
				retryAfter: 30000,
			}),
		);
		await expect(
			makeSalesflareRequest({ key: 'secret' }, '/tasks', { method: 'GET' }),
		).rejects.toThrow(SalesflareAPIError);
		expect(requestMock).toHaveBeenCalledTimes(1);
		// enabled stays true so the shared transport reads the Retry-After
		// headers and attaches them to the thrown error; maxRetries 0 keeps
		// the transport itself single-attempt.
		expect(requestMock.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: expect.objectContaining({
				enabled: true,
				maxRetries: 0,
				headerNames: expect.objectContaining({ retryAfter: 'Retry-After' }),
			}),
		});
	});

	it('preserves status and Retry-After metadata on wrapped rate limits', async () => {
		requestMock.mockRejectedValue(
			new ApiError(apiRequest, rateLimitResult, 'Too Many Requests', {
				retryAfter: 30000,
			}),
		);
		const error = await makeSalesflareRequest({ key: 'secret' }, '/tasks', {
			method: 'GET',
		}).catch((caught: unknown) => caught); // unknown: the rejection value is opaque; narrowed by the assertions below
		expect(error).toBeInstanceOf(SalesflareAPIError);
		expect((error as SalesflareAPIError).status).toBe(429);
		expect((error as SalesflareAPIError).retryAfter).toBe(30000);
	});

	it('routes 429 through the plugin error handler with its retry budget', async () => {
		const rateLimit = new ApiError(
			apiRequest,
			rateLimitResult,
			'Too Many Requests',
			{ retryAfter: 30000 },
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimit)).toBe(true);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(rateLimit);
		expect(strategy.maxRetries).toBe(5);
		expect(strategy.headersRetryAfterMs).toBe(30000);
	});

	it('does not retry auth failures', async () => {
		const unauthorized: ApiResult = {
			url: 'https://api.salesflare.com/tasks',
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
			body: {},
		};
		const authError = new ApiError(apiRequest, unauthorized, 'Unauthorized');
		expect(errorHandlers.AUTH_ERROR.match(authError)).toBe(true);
		// The auth handler declares no use for the error argument; the
		// runtime still passes it, but the concrete policy takes none.
		const strategy = await errorHandlers.AUTH_ERROR.handler();
		expect(strategy.maxRetries).toBe(0);
	});
});
