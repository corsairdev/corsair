import { ApiError } from 'corsair/http';
import { z } from 'zod';
import { FolkAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function makeApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v1/people' },
		{
			url: 'https://api.folk.app/v1/people',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('error-handlers.ts', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches 429 ApiError and returns maxRetries: 0 with headersRetryAfterMs', async () => {
			const error = makeApiError(429, 'Too Many Requests', 4500);

			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
			expect(result).toEqual({
				maxRetries: 0,
				headersRetryAfterMs: 4500,
			});
		});

		it('matches FolkAPIError with status 429 and extracts retryAfter', async () => {
			const error = new FolkAPIError('Rate limited', {
				status: 429,
				code: 'TOO_MANY_REQUESTS',
				retryAfter: 2000,
			});

			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
			expect(result).toEqual({
				maxRetries: 0,
				headersRetryAfterMs: 2000,
			});
		});

		it('matches messages mentioning rate limit keywords', () => {
			const error = new Error('Client error: 429 rate_limited by host');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches 401 and 403 errors and returns maxRetries: 0', async () => {
			const unauthorized = makeApiError(401, 'Unauthorized');
			const forbidden = makeApiError(403, 'Forbidden');
			const folkAuth = new FolkAPIError('Invalid key', { status: 401 });

			expect(errorHandlers.AUTH_ERROR.match(unauthorized)).toBe(true);
			expect(errorHandlers.AUTH_ERROR.match(forbidden)).toBe(true);
			expect(errorHandlers.AUTH_ERROR.match(folkAuth)).toBe(true);

			const result = await errorHandlers.AUTH_ERROR.handler(unauthorized);
			expect(result).toEqual({ maxRetries: 0 });
		});

		it('matches messages mentioning unauthorized or invalid_auth', () => {
			expect(
				errorHandlers.AUTH_ERROR.match(new Error('User is unauthorized')),
			).toBe(true);
			expect(
				errorHandlers.AUTH_ERROR.match(new Error('Rejected: invalid_auth')),
			).toBe(true);
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches 404 ApiError and FolkAPIError', async () => {
			const notFound = makeApiError(404, 'Not Found');
			const folkNotFound = new FolkAPIError('Resource missing', {
				status: 404,
			});

			expect(errorHandlers.NOT_FOUND_ERROR.match(notFound)).toBe(true);
			expect(errorHandlers.NOT_FOUND_ERROR.match(folkNotFound)).toBe(true);

			const result = await errorHandlers.NOT_FOUND_ERROR.handler(notFound);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('VALIDATION_ERROR', () => {
		it('matches 400 and 422 errors and ZodError', async () => {
			const badReq = makeApiError(400, 'Bad Request');
			const unprocessable = makeApiError(422, 'Unprocessable Entity');
			const zodResult = z.string().safeParse(123);
			const zodErr = !zodResult.success ? zodResult.error : new Error();

			expect(errorHandlers.VALIDATION_ERROR.match(badReq)).toBe(true);
			expect(errorHandlers.VALIDATION_ERROR.match(unprocessable)).toBe(true);
			expect(errorHandlers.VALIDATION_ERROR.match(zodErr)).toBe(true);

			const result = await errorHandlers.VALIDATION_ERROR.handler(badReq);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('SERVER_ERROR', () => {
		it('matches 500 and 503 errors and returns maxRetries: 0', async () => {
			const serverErr = makeApiError(500, 'Internal Server Error');
			const gatewayErr = makeApiError(503, 'Service Unavailable');

			expect(errorHandlers.SERVER_ERROR.match(serverErr)).toBe(true);
			expect(errorHandlers.SERVER_ERROR.match(gatewayErr)).toBe(true);

			const result = await errorHandlers.SERVER_ERROR.handler(serverErr);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('DEFAULT', () => {
		it('matches any arbitrary error and returns maxRetries: 0', async () => {
			const generic = new Error('Random unexpected network glitch');
			expect(errorHandlers.DEFAULT.match(generic)).toBe(true);

			const result = await errorHandlers.DEFAULT.handler(generic);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('mergeErrorHandlers', () => {
		it('returns built-ins when no caller handlers are passed', () => {
			const merged = mergeErrorHandlers();
			expect(merged).toBe(errorHandlers);
		});

		it('places caller-supplied handlers first and preserves DEFAULT last', () => {
			const customHandler = {
				match: (err: Error) => err.message.includes('custom'),
				handler: async () => ({ maxRetries: 3 }),
			};
			const customDefault = {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			};

			const merged = mergeErrorHandlers({
				CUSTOM_ERROR: customHandler,
				DEFAULT: customDefault,
			});

			const keys = Object.keys(merged);
			expect(keys[0]).toBe('CUSTOM_ERROR');
			expect(keys[keys.length - 1]).toBe('DEFAULT');
			expect(merged.DEFAULT).toBe(customDefault);
		});
	});
});
