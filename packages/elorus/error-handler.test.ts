import { ElorusAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Elorus error handlers', () => {
	it('recognizes 429 and carries Retry-After without retrying', async () => {
		const error = new ElorusAPIError('Rate limited', 429, 3000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 3000,
		});
	});

	it.each([401, 403])('recognizes authentication status %s', (status) => {
		expect(
			errorHandlers.AUTH_ERROR.match(new ElorusAPIError('Auth failed', status)),
		).toBe(true);
	});

	it.each([400, 422])('recognizes invalid request status %s', (status) => {
		expect(
			errorHandlers.BAD_REQUEST_ERROR.match(
				new ElorusAPIError('Invalid input', status),
			),
		).toBe(true);
	});

	it('recognizes missing resources and server failures', () => {
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(new ElorusAPIError('Missing', 404)),
		).toBe(true);
		expect(
			errorHandlers.SERVER_ERROR.match(new ElorusAPIError('Unavailable', 503)),
		).toBe(true);
	});

	it('does not retry non-idempotent server failures or unmatched errors', async () => {
		const error = new ElorusAPIError('Server failure', 500);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
