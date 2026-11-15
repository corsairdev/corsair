import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { makeKlipfolioRequest } from './client';
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

	it('lets core retry 429s and passes its ApiError through unchanged', async () => {
		const rateLimit = new ApiError(
			apiRequest,
			rateLimitResult,
			'Too Many Requests',
			{ retryAfter: 30000 },
		);
		requestMock.mockRejectedValue(rateLimit);
		const error = await makeKlipfolioRequest({ key: 'secret' }, '/profile', {
			method: 'GET',
		}).catch((caught: unknown) => caught); // unknown: the rejection value is opaque; narrowed by the assertions below
		// Same instance: status and retryAfter stay readable by core.
		expect(error).toBe(rateLimit);
		expect(requestMock.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: expect.objectContaining({
				enabled: true,
				maxRetries: 3,
				headerNames: expect.objectContaining({ retryAfter: 'Retry-After' }),
			}),
		});
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

	it('keeps the provider error body (meta.error_code) on the ApiError', async () => {
		// Shape of a real Klipfolio 401 (route probe, 11-16).
		const unauthorized: ApiResult = {
			url: 'https://app.klipfolio.com/api/1.0/users',
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
			body: {
				meta: {
					success: false,
					status: 401,
					error_code: 'auth_not_provided',
					error_desc: 'This operation requires authentication',
				},
			},
		};
		requestMock.mockRejectedValue(
			new ApiError(apiRequest, unauthorized, 'Unauthorized'),
		);
		const error = await makeKlipfolioRequest({ key: 'secret' }, '/users', {
			method: 'GET',
		}).catch((caught: unknown) => caught); // unknown: the rejection value is opaque; narrowed by the assertions below
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
		expect((error as ApiError).body.meta.error_code).toBe('auth_not_provided');
		expect(errorHandlers.AUTH_ERROR.match(error as ApiError)).toBe(true);
	});

	it('does not retry a 429 again in the plugin handler', async () => {
		const rateLimit = new ApiError(
			apiRequest,
			rateLimitResult,
			'Too Many Requests',
			{ retryAfter: 30000 },
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimit)).toBe(true);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(rateLimit);
		expect(strategy.maxRetries).toBe(0);
		expect(strategy.headersRetryAfterMs).toBe(30000);
	});
});
