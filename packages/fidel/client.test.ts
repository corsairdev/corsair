import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { FidelAPIError, makeFidelRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const requestMock = jest.mocked(request);

const apiRequest: ApiRequestOptions = { method: 'GET', url: '/v1/brands' };
const rateLimitResult: ApiResult = {
	url: 'https://api.fidel.uk/v1/brands',
	ok: false,
	status: 429,
	statusText: 'Too Many Requests',
	body: {},
};

describe('Fidel client', () => {
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
			makeFidelRequest({ key: 'secret' }, '/v1/brands', { method: 'GET' }),
		).rejects.toThrow(FidelAPIError);
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
		const error = await makeFidelRequest({ key: 'secret' }, '/v1/brands', {
			method: 'GET',
		}).catch((caught: unknown) => caught); // unknown: the rejection value is opaque; narrowed by the assertions below
		expect(error).toBeInstanceOf(FidelAPIError);
		expect((error as FidelAPIError).status).toBe(429);
		expect((error as FidelAPIError).retryAfter).toBe(30000);
	});

	it('preserves the provider error code and message from the body', async () => {
		const badRequest: ApiResult = {
			url: 'https://api.fidel.uk/v1/brands',
			ok: false,
			status: 400,
			statusText: 'Bad Request',
			body: {
				error: {
					code: 'item-save',
					message: 'Item already exists',
					date: '2024-01-01T00:00:00.000Z',
				},
			},
		};
		requestMock.mockRejectedValue(
			new ApiError(apiRequest, badRequest, 'Bad Request'),
		);
		const error = await makeFidelRequest({ key: 'secret' }, '/v1/brands', {
			method: 'POST',
		}).catch((caught: unknown) => caught); // unknown: the rejection value is opaque; narrowed by the assertions below
		expect(error).toBeInstanceOf(FidelAPIError);
		expect((error as FidelAPIError).status).toBe(400);
		expect((error as FidelAPIError).code).toBe('item-save');
		expect((error as FidelAPIError).message).toBe('Item already exists');
	});

	it('sends the provider Fidel-Key header without a Bearer rewrite', async () => {
		requestMock.mockResolvedValue({ items: [] });
		await makeFidelRequest({ key: 'sk_test_key' }, '/v1/brands', {
			method: 'GET',
		});
		const config = requestMock.mock.calls[0]?.[0] as unknown as {
			HEADERS: Record<string, string>;
			TOKEN?: string;
		}; // unknown: the shared transport config is a structural record
		expect(config.HEADERS['Fidel-Key']).toBe('sk_test_key');
		expect(config.HEADERS.Authorization).toBeUndefined();
		expect(config.TOKEN).toBeUndefined();
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
