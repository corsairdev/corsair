import { FinageAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Finage error handlers', () => {
	it('retries rate-limit failures without losing retry metadata', async () => {
		const error = new FinageAPIError(
			'rate_limited: Too many requests',
			429,
			'rate_limited',
			30_000,
		);
		const handler = errorHandlers.RATE_LIMIT_ERROR;

		expect(handler.match(error)).toBe(true);
		await expect(handler.handler(error)).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 30_000,
		});
	});

	it('does not retry authentication failures', async () => {
		const error = new FinageAPIError('Unauthorized', 401);
		const handler = errorHandlers.AUTH_ERROR;

		expect(handler.match(error)).toBe(true);
		await expect(handler.handler()).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not classify unrelated failures as rate limits', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('429 text'))).toBe(
			false,
		);
		expect(errorHandlers.AUTH_ERROR.match(new Error('Unauthorized'))).toBe(
			false,
		);
	});
});
