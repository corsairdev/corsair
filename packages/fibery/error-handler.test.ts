import { FiberyAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Fibery error handlers', () => {
	it('extracts Retry-After for rate limits without automatic replays', async () => {
		const error = new FiberyAPIError('Too Many Requests', 429, undefined, 2500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 2500,
		});
	});

	it.each([401, 403])(
		'does not retry HTTP %i authorization failures',
		async (status) => {
			const error = new FiberyAPIError('Unauthorized', status);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it.each([400, 404, 422])(
		'classifies HTTP %i as a non-retryable request error',
		async (status) => {
			const error = new FiberyAPIError('Bad request', status);
			expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it('does not retry writes on server errors or unknown failures', async () => {
		const error = new FiberyAPIError('Internal server error', 500);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
