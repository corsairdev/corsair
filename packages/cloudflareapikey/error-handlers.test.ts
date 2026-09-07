import { CloudflareApiKeyAPIError } from './api-error';
import { errorHandlers } from './error-handlers';

describe('error handlers', () => {
	it('retries wrapped 429 errors and keeps Retry-After', async () => {
		const error = new CloudflareApiKeyAPIError(
			'Too Many Requests',
			undefined,
			429,
			1500,
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 1500 });
	});

	it('does not retry 401', async () => {
		const error = new CloudflareApiKeyAPIError('Unauthorized', 9109, 401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not replay unmatched failures', async () => {
		const error = new CloudflareApiKeyAPIError('timeout', undefined, 503);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(error.status).toBe(503);
	});
});
