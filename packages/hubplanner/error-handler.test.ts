import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function createApiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/test' },
		{
			url: 'https://app.hubplanner.com/api/v1/test',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
	);
}

describe('Hub Planner Error Handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches 429 ApiError status', () => {
			const err = createApiError(429, 'Rate limit exceeded');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		});

		it('matches error messages indicating rate limiting', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(
					new Error('rate_limited by server'),
				),
			).toBe(true);
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('HTTP 429 received')),
			).toBe(true);
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too many requests')),
			).toBe(true);
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate limit reached')),
			).toBe(true);
		});

		it('does not match unrelated errors', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(
					createApiError(500, 'Server error'),
				),
			).toBe(false);
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('Network disconnected')),
			).toBe(false);
		});

		it('returns maxRetries: 0 to enforce single-owner rate limiting', async () => {
			const err = createApiError(429, 'Rate limit exceeded');
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches 401 and 403 ApiError statuses', () => {
			expect(
				errorHandlers.AUTH_ERROR.match(createApiError(401, 'Unauthorized')),
			).toBe(true);
			expect(
				errorHandlers.AUTH_ERROR.match(createApiError(403, 'Forbidden')),
			).toBe(true);
		});

		it('matches messages indicating authentication failures', () => {
			expect(
				errorHandlers.AUTH_ERROR.match(new Error('unauthorized access')),
			).toBe(true);
			expect(
				errorHandlers.AUTH_ERROR.match(new Error('invalid_auth token')),
			).toBe(true);
			expect(
				errorHandlers.AUTH_ERROR.match(new Error('forbidden operation')),
			).toBe(true);
			expect(errorHandlers.AUTH_ERROR.match(new Error('invalid api key'))).toBe(
				true,
			);
		});

		it('does not match unrelated errors', () => {
			expect(
				errorHandlers.AUTH_ERROR.match(createApiError(404, 'Not found')),
			).toBe(false);
		});

		it('returns maxRetries: 0 for auth errors', async () => {
			const err = createApiError(401, 'Unauthorized');
			const result = await errorHandlers.AUTH_ERROR.handler(err);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('BAD_REQUEST_ERROR', () => {
		it('matches 400 and 422 ApiError statuses', () => {
			expect(
				errorHandlers.BAD_REQUEST_ERROR.match(
					createApiError(400, 'Bad Request'),
				),
			).toBe(true);
			expect(
				errorHandlers.BAD_REQUEST_ERROR.match(
					createApiError(422, 'Unprocessable Entity'),
				),
			).toBe(true);
		});

		it('matches messages indicating validation or bad requests', () => {
			expect(
				errorHandlers.BAD_REQUEST_ERROR.match(new Error('bad request payload')),
			).toBe(true);
			expect(
				errorHandlers.BAD_REQUEST_ERROR.match(
					new Error('validation error occurred'),
				),
			).toBe(true);
			expect(
				errorHandlers.BAD_REQUEST_ERROR.match(
					new Error('unprocessable entity content'),
				),
			).toBe(true);
		});

		it('returns maxRetries: 0 for validation errors', async () => {
			const err = createApiError(400, 'Bad request');
			const result = await errorHandlers.BAD_REQUEST_ERROR.handler(err);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches 404 ApiError status and not found messages', () => {
			expect(
				errorHandlers.NOT_FOUND_ERROR.match(createApiError(404, 'Not Found')),
			).toBe(true);
			expect(
				errorHandlers.NOT_FOUND_ERROR.match(new Error('Resource not found')),
			).toBe(true);
			expect(
				errorHandlers.NOT_FOUND_ERROR.match(new Error('Error 404 missing')),
			).toBe(true);
		});

		it('returns maxRetries: 0 for not found errors', async () => {
			const err = createApiError(404, 'Not Found');
			const result = await errorHandlers.NOT_FOUND_ERROR.handler(err);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('DEFAULT', () => {
		it('matches any error as fallback', () => {
			expect(
				errorHandlers.DEFAULT.match(new Error('Unexpected exception')),
			).toBe(true);
			expect(
				errorHandlers.DEFAULT.match(
					createApiError(500, 'Internal Server Error'),
				),
			).toBe(true);
		});

		it('returns maxRetries: 0 for fallback errors', async () => {
			const result = await errorHandlers.DEFAULT.handler(
				new Error('Random failure'),
			);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('Handler precedence order', () => {
		it('has rate limit and auth handlers before default', () => {
			const keys = Object.keys(errorHandlers);
			expect(keys[keys.length - 1]).toBe('DEFAULT');
			expect(keys.indexOf('RATE_LIMIT_ERROR')).toBeLessThan(
				keys.indexOf('DEFAULT'),
			);
			expect(keys.indexOf('AUTH_ERROR')).toBeLessThan(keys.indexOf('DEFAULT'));
		});
	});
});
