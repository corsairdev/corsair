import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { KlipfolioAPIError, makeKlipfolioRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const requestMock = jest.mocked(request);

const apiRequest: ApiRequestOptions = { method: 'GET', url: '/profile' };
const rateLimitResult: ApiResult = {
	url: 'https://app.klipfolio.com/api/1.0/profile',
	ok: false,
	status: 429,
	statusText: 'Too Many Requests',
	body: {},
};

describe('Klipfolio client', () => {
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
			makeKlipfolioRequest({ key: 'secret' }, '/profile', { method: 'GET' }),
		).rejects.toThrow(KlipfolioAPIError);
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
		const error = await makeKlipfolioRequest({ key: 'secret' }, '/profile', {
			method: 'GET',
		}).catch((caught: unknown) => caught); // unknown: the rejection value is opaque; narrowed by the assertions below
		expect(error).toBeInstanceOf(KlipfolioAPIError);
		expect((error as KlipfolioAPIError).status).toBe(429);
		expect((error as KlipfolioAPIError).retryAfter).toBe(30000);
	});

	it('sends the provider kf-api-key header without a Bearer rewrite', async () => {
		requestMock.mockResolvedValue({ data: {}, meta: {} });
		await makeKlipfolioRequest({ key: 'kf_test_key' }, '/profile', {
			method: 'GET',
		});
		const config = requestMock.mock.calls[0]?.[0] as unknown as {
			HEADERS: Record<string, string>;
			TOKEN?: string;
		}; // unknown: the shared transport config is a structural record
		expect(config.HEADERS['kf-api-key']).toBe('kf_test_key');
		expect(config.HEADERS.Authorization).toBeUndefined();
		expect(config.TOKEN).toBeUndefined();
	});

	it('preserves the provider error code and message from the body', async () => {
		const forbidden: ApiResult = {
			url: 'https://app.klipfolio.com/api/1.0/users',
			ok: false,
			status: 403,
			statusText: 'Forbidden',
			body: { error: { code: 'user.manage', message: 'Not permitted' } },
		};
		requestMock.mockRejectedValue(
			new ApiError(apiRequest, forbidden, 'Forbidden'),
		);
		const error = await makeKlipfolioRequest({ key: 'secret' }, '/users', {
			method: 'GET',
		}).catch((caught: unknown) => caught); // unknown: the rejection value is opaque; narrowed by the assertions below
		expect(error).toBeInstanceOf(KlipfolioAPIError);
		expect((error as KlipfolioAPIError).status).toBe(403);
		expect((error as KlipfolioAPIError).code).toBe('user.manage');
		expect((error as KlipfolioAPIError).message).toBe('Not permitted');
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
});
