import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { gosquared } from './index';

function createApiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/test' },
		{
			url: 'https://api.gosquared.com/test',
			ok: false,
			status,
			statusText: message,
			body: { message },
		},
		message,
		retryAfter !== undefined ? { retryAfter } : undefined,
	);
}

describe('GoSquared error-handlers tests', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches ApiError with status 429 and returns maxRetries 0 with retryAfter', async () => {
			const err = createApiError(429, 'Too Many Requests', 5000);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);

			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
			expect(result).toEqual({
				maxRetries: 0,
				headersRetryAfterMs: 5000,
			});
		});

		it('matches generic error with rate limit text or code 4002', async () => {
			const genericErr = new Error('Error 4002: Request rate limit exceeded');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(genericErr)).toBe(true);

			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(genericErr);
			expect(result).toEqual({
				maxRetries: 0,
				headersRetryAfterMs: undefined,
			});
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches ApiError with 401 or 403 status', async () => {
			const err401 = createApiError(401, 'Unauthorized');
			const err403 = createApiError(403, 'Forbidden');
			expect(errorHandlers.AUTH_ERROR.match(err401)).toBe(true);
			expect(errorHandlers.AUTH_ERROR.match(err403)).toBe(true);

			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});

		it('matches message strings for unauthenticated / 4001', async () => {
			const textErr = new Error('Error 4001: API key not authorised for site');
			expect(errorHandlers.AUTH_ERROR.match(textErr)).toBe(true);
		});
	});

	describe('BAD_REQUEST_ERROR', () => {
		it('matches ApiError with 400 or 422 status', async () => {
			const err400 = createApiError(400, 'Bad Request');
			const err422 = createApiError(422, 'Unprocessable Entity');
			expect(errorHandlers.BAD_REQUEST_ERROR.match(err400)).toBe(true);
			expect(errorHandlers.BAD_REQUEST_ERROR.match(err422)).toBe(true);

			await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});

		it('matches parameter error codes 4000, 4003, and 4004', async () => {
			expect(
				errorHandlers.BAD_REQUEST_ERROR.match(
					new Error('Error 4000: Omitted parameter'),
				),
			).toBe(true);
			expect(
				errorHandlers.BAD_REQUEST_ERROR.match(
					new Error('Error 4003: Invalid parameter'),
				),
			).toBe(true);
			expect(
				errorHandlers.BAD_REQUEST_ERROR.match(
					new Error('Error 4004: Invalid parameter value'),
				),
			).toBe(true);
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches ApiError with 404 status', async () => {
			const err404 = createApiError(404, 'Not Found');
			expect(errorHandlers.NOT_FOUND_ERROR.match(err404)).toBe(true);
			await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});

		it('matches generic error with not found text', async () => {
			expect(
				errorHandlers.NOT_FOUND_ERROR.match(new Error('Resource not found')),
			).toBe(true);
		});
	});

	describe('DEFAULT error handler', () => {
		it('matches any arbitrary error and returns maxRetries 0', async () => {
			expect(errorHandlers.DEFAULT.match()).toBe(true);
			await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});
	});

	describe('Error handler ordering', () => {
		it('ensures caller handlers take precedence and DEFAULT is placed last', () => {
			const customMatch = jest.fn();
			const plugin = gosquared({
				errorHandlers: {
					CUSTOM_ERROR: {
						match: customMatch,
						handler: async () => ({ maxRetries: 2 }),
					},
				},
			});

			const handlerKeys = Object.keys(plugin.errorHandlers);
			expect(handlerKeys[0]).toBe('CUSTOM_ERROR');
			expect(handlerKeys[handlerKeys.length - 1]).toBe('DEFAULT');
		});
	});
});
