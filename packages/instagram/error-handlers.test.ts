import { InstagramAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('instagram errorHandlers', () => {
	it('retries Graph rate-limit codes and 429 messages', async () => {
		const graphLimit = new InstagramAPIError('Application request limit', 4);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(graphLimit)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(graphLimit),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: undefined });

		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('HTTP 429'))).toBe(
			true,
		);
	});

	it('does not retry auth failures', async () => {
		const expired = new InstagramAPIError('Invalid OAuth access token', 190);
		expect(errorHandlers.AUTH_ERROR.match(expired)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
