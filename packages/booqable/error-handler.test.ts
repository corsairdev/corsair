import { ApiError } from 'corsair/http';
import { BooqableAPIError } from './client';
import { errorHandlers } from './error-handlers';

function booqableError(status: number, message: string, retryAfter?: number) {
	const apiError = new ApiError(
		{ url: '/users', method: 'GET' },
		{
			url: '/users',
			ok: false,
			status,
			statusText: 'Error',
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
	return new BooqableAPIError(message, { cause: apiError });
}

describe('Booqable error handlers', () => {
	it('matches rate-limit failures by 429 status', () => {
		const error = booqableError(429, 'Too Many Requests', 1500);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
	});

	it('matches rate-limit failures by message when status is missing', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate_limited')),
		).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('boom'))).toBe(false);
	});

	it('retries rate-limit failures with the provider retry-after delay', async () => {
		const error = booqableError(429, 'Too Many Requests', 1500);

		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('matches auth failures by 401 status without retries', async () => {
		const error = booqableError(401, 'Unauthorized');

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches auth failures by message when status is missing', () => {
		expect(errorHandlers.AUTH_ERROR.match(new Error('unauthorized'))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(new Error('boom'))).toBe(false);
	});

	it('falls back to the default handler for anything else', async () => {
		const error = new Error('boom');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
