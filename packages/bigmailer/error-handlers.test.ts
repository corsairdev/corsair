/** Covers how each BigMailer failure is classified for retry. */
import { BigmailerAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('errorHandlers', () => {
	it('retries a 429, honouring a retry-after carried on the error', async () => {
		const error = new BigmailerAPIError('rate limited', 429, 2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBeGreaterThan(0);
		expect(result.headersRetryAfterMs).toBe(2000);
	});

	it('never retries a 401', async () => {
		const error = new BigmailerAPIError('unauthorized', 401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('never retries a 403', async () => {
		const error = new BigmailerAPIError('forbidden', 403);
		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.PERMISSION_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('never retries a 404', async () => {
		const error = new BigmailerAPIError('not found', 404);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.NOT_FOUND_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('classifies a plain Error with no status by message text alone', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('got a 429'))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(new Error('401 rejected'))).toBe(
			true,
		);
	});

	it('falls back to DEFAULT for an unrecognised status', () => {
		const error = new BigmailerAPIError('server exploded', 500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(false);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});
