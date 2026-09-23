import type { ErrorContext } from 'corsair/core';
import { CloudflareApiKeyAPIError } from './api-error';
import { errorHandlers } from './error-handlers';

function context(operation: string): ErrorContext {
	return {
		pluginId: 'cloudflareapikey',
		operation,
		input: {},
		originalError: new Error('unmatched'),
	};
}

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

	it('retries unmatched failures on idempotent reads', async () => {
		const error = new CloudflareApiKeyAPIError('timeout', undefined, 503);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(
			errorHandlers.DEFAULT.handler(error, context('zones.list')),
		).resolves.toEqual({ maxRetries: 3 });
		await expect(
			errorHandlers.DEFAULT.handler(error, context('dns.list')),
		).resolves.toEqual({ maxRetries: 3 });
	});

	it('does not replay unmatched mutation failures', async () => {
		const error = new CloudflareApiKeyAPIError('timeout', undefined, 503);
		await expect(
			errorHandlers.DEFAULT.handler(error, context('dns.create')),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			errorHandlers.DEFAULT.handler(error, context('s3.upload')),
		).resolves.toEqual({ maxRetries: 0 });
		expect(error.status).toBe(503);
	});
});
