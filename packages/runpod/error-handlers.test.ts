import { RunpodAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('RATE_LIMIT_ERROR', () => {
	it('matches a 429 RunpodAPIError and forwards retryAfter', async () => {
		const error = new RunpodAPIError('Too Many Requests', undefined, 429, 5000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 5000,
		});
	});

	it('matches a rate-limit message when no status is present', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new RunpodAPIError('rate_limited')),
		).toBe(true);
	});
});

describe('AUTH_ERROR', () => {
	it('matches 401 and 403', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(
				new RunpodAPIError('nope', undefined, 401),
			),
		).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(
				new RunpodAPIError('nope', undefined, 403),
			),
		).toBe(true);
	});

	it('does not retry', async () => {
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
