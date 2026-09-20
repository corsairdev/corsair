import { AblyAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('errorHandlers', () => {
	it('retries 429 using preserved retryAfter', async () => {
		const error = new AblyAPIError('rate limited', '42900', 429, 1500);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('does not retry 401', async () => {
		const error = new AblyAPIError('unauthorized', '40100', 401);

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('ignores non-429 messages that are not AblyAPIError 429', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('429'))).toBe(false);
	});
});
