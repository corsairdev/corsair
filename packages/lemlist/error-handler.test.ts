import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { lemlist } from './index';

function makeApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/team' },
		{
			url: 'https://api.lemlist.com/api/team',
			ok: false,
			status,
			statusText: message,
			body: { error: message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('error-handlers.ts', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches 429 status and parses retryAfter', async () => {
			const err = makeApiError(429, 'Too Many Requests', 3500);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);

			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
			expect(result).toEqual({ maxRetries: 2, headersRetryAfterMs: 3500 });
		});

		it('does not treat a non-429 provider error that mentions a rate limit as one', () => {
			const err = makeApiError(504, 'Upstream rate limit');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(false);
			expect(errorHandlers.SERVER_ERROR.match(err)).toBe(true);
		});

		it('does not retry an error without an HTTP status, whatever its text', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('Rate limit exceeded')),
			).toBe(false);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches 401 and 403 ApiError', async () => {
			const err401 = makeApiError(401, 'Unauthorized');
			const err403 = makeApiError(403, 'Forbidden');
			expect(errorHandlers.AUTH_ERROR.match(err401)).toBe(true);
			expect(errorHandlers.AUTH_ERROR.match(err403)).toBe(true);

			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});

		it('matches auth error messages by substring', async () => {
			const err = new Error('No API key provided / Bad team');
			expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches 404 status and message', async () => {
			const err404 = makeApiError(404, 'Lead not found');
			expect(errorHandlers.NOT_FOUND_ERROR.match(err404)).toBe(true);

			await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});
	});

	describe('BAD_REQUEST_ERROR', () => {
		it('matches 400 and 422 status', async () => {
			const err400 = makeApiError(400, 'Bad request');
			const err422 = makeApiError(422, 'Unprocessable Entity');
			expect(errorHandlers.BAD_REQUEST_ERROR.match(err400)).toBe(true);
			expect(errorHandlers.BAD_REQUEST_ERROR.match(err422)).toBe(true);

			await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});
	});

	describe('SERVER_ERROR', () => {
		it('matches 500 status', async () => {
			const err500 = makeApiError(500, 'Internal Server Error');
			expect(errorHandlers.SERVER_ERROR.match(err500)).toBe(true);

			await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});
	});

	describe('DEFAULT', () => {
		it('matches any error and returns maxRetries: 0', async () => {
			expect(errorHandlers.DEFAULT.match()).toBe(true);

			await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});
	});

	describe('handler precedence and merging in lemlist() plugin', () => {
		it('gives caller error handlers precedence over built-in handlers', () => {
			const customRateLimitHandler = jest.fn();
			const plugin = lemlist({
				key: 'dummy',
				errorHandlers: {
					RATE_LIMIT_ERROR: {
						match: () => true,
						handler: customRateLimitHandler,
					},
				},
			});

			const handlers = plugin.errorHandlers;
			expect(handlers).toBeDefined();
			expect(handlers?.RATE_LIMIT_ERROR?.handler).toBe(customRateLimitHandler);
			expect(handlers?.DEFAULT).toBeDefined();
		});
	});
});
