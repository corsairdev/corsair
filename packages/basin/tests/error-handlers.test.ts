import { ApiError } from 'corsair/http';
import { BasinAPIError } from '../client';
import { errorHandlers } from '../error-handlers';

function makeApiError(
	status: number,
	message = 'Request failed',
	retryAfter?: number,
) {
	return new ApiError(
		{ method: 'GET', url: '/api/v1/test' },
		{
			body: { message },
			ok: false,
			status,
			statusText: message,
			url: 'https://usebasin.com/api/v1/test',
		},
		message,
		retryAfter !== undefined ? { retryAfter } : undefined,
	);
}

function makeBasinApiError(
	status: number,
	message = 'Request failed',
	retryAfter?: number,
) {
	const cause = makeApiError(status, message, retryAfter);
	return new BasinAPIError(message, String(status), { cause });
}

function matchHandler(error: Error): string {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler.match(error)) {
			return name;
		}
	}
	return 'UNMATCHED';
}

describe('Basin error handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches ApiError with status 429', () => {
			const error = makeApiError(429, 'Too Many Requests');
			expect(matchHandler(error)).toBe('RATE_LIMIT_ERROR');
		});

		it('matches BasinAPIError with status 429', () => {
			const error = makeBasinApiError(429, 'Rate limit exceeded');
			expect(matchHandler(error)).toBe('RATE_LIMIT_ERROR');
		});

		it('matches error message with rate limit text for transport errors', () => {
			const error = new Error('rate_limited by gateway');
			expect(matchHandler(error)).toBe('RATE_LIMIT_ERROR');
		});

		// Retry-After is surfaced so callers can back off, but the handler asks
		// for no binder-level retry: the transport already retried the 429 via
		// BASIN_RATE_LIMIT_CONFIG, and the binder discards a successful retry's
		// value anyway, so retrying again would only replay requests.
		it('surfaces retryAfter from ApiError without re-driving the call', async () => {
			const error = makeApiError(429, 'Too Many Requests', 10000);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
			expect(result.headersRetryAfterMs).toBe(10000);
			expect(result.maxRetries).toBe(0);
		});

		it('surfaces retryAfter from BasinAPIError without re-driving the call', async () => {
			const error = makeBasinApiError(429, 'Too Many Requests', 5000);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
			expect(result.headersRetryAfterMs).toBe(5000);
			expect(result.maxRetries).toBe(0);
		});

		it('never asks the binder to retry, for any handler', async () => {
			// Handlers differ in arity: most take a context, RATE_LIMIT_ERROR does
			// not. Call them through a common shape so the guard covers all of them.
			type AnyHandler = (
				error: Error,
				context: { operation: string },
			) => Promise<{ maxRetries: number }>;

			for (const [name, entry] of Object.entries(errorHandlers)) {
				const handler = entry.handler as AnyHandler;
				const result = await handler(new Error('boom'), {
					operation: 'forms.list',
				});
				expect([name, result.maxRetries]).toEqual([name, 0]);
			}
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches ApiError with status 401', () => {
			const error = makeApiError(401, 'Unauthorized');
			expect(matchHandler(error)).toBe('AUTH_ERROR');
		});

		it('matches message with unauthorized for statusless error', () => {
			const error = new Error('Unauthorized token');
			expect(matchHandler(error)).toBe('AUTH_ERROR');
		});

		it('returns 0 retries for auth errors', async () => {
			const error = makeApiError(401);
			const result = await errorHandlers.AUTH_ERROR.handler(error, {
				operation: 'forms.list',
			});
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('PERMISSION_ERROR', () => {
		it('matches status 403', () => {
			const error = makeApiError(403, 'Forbidden');
			expect(matchHandler(error)).toBe('PERMISSION_ERROR');
		});

		it('returns 0 retries for permission errors', async () => {
			const error = makeApiError(403);
			const result = await errorHandlers.PERMISSION_ERROR.handler(error, {
				operation: 'forms.delete',
			});
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches status 404', () => {
			const error = makeApiError(404, 'Not Found');
			expect(matchHandler(error)).toBe('NOT_FOUND_ERROR');
		});

		it('returns 0 retries for not found errors', async () => {
			const error = makeApiError(404);
			const result = await errorHandlers.NOT_FOUND_ERROR.handler(error, {
				operation: 'forms.get',
			});
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('VALIDATION_ERROR', () => {
		it('matches status 400', () => {
			const error = makeApiError(400, 'Bad Request');
			expect(matchHandler(error)).toBe('VALIDATION_ERROR');
		});

		it('matches status 422', () => {
			const error = makeApiError(422, 'Unprocessable Entity');
			expect(matchHandler(error)).toBe('VALIDATION_ERROR');
		});

		it('returns 0 retries for validation errors', async () => {
			const error = makeApiError(422);
			const result = await errorHandlers.VALIDATION_ERROR.handler(error, {
				operation: 'forms.create',
			});
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('SERVER_ERROR', () => {
		it('matches 500 status', () => {
			const error = makeApiError(500, 'Internal Server Error');
			expect(matchHandler(error)).toBe('SERVER_ERROR');
		});

		it('matches 503 status', () => {
			const error = makeApiError(503, 'Service Unavailable');
			expect(matchHandler(error)).toBe('SERVER_ERROR');
		});

		it('returns 0 retries for server errors', async () => {
			const error = makeApiError(500);
			const result = await errorHandlers.SERVER_ERROR.handler(error, {
				operation: 'forms.create',
			});
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('DEFAULT fallback', () => {
		it('catches all unhandled errors', () => {
			const error = new Error('Random unexpected error');
			expect(matchHandler(error)).toBe('DEFAULT');
		});

		it('returns 0 retries for default handler', async () => {
			const error = new Error('Unknown');
			const result = await errorHandlers.DEFAULT.handler(error, {
				operation: 'unknown.op',
			});
			expect(result.maxRetries).toBe(0);
		});
	});
});
