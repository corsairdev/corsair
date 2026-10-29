import { WaboxappAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('RATE_LIMIT_ERROR', () => {
	it('matches a 429 WaboxappAPIError and forwards retryAfter', async () => {
		const error = new WaboxappAPIError(
			'Too Many Requests',
			undefined,
			429,
			4000,
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 4000,
		});
	});

	it('matches a rate-limit message when no status is present', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new WaboxappAPIError('rate_limited'),
			),
		).toBe(true);
	});
});

describe('AUTH_ERROR', () => {
	it('matches 401 and 403', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(
				new WaboxappAPIError('nope', undefined, 401),
			),
		).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(
				new WaboxappAPIError('nope', undefined, 403),
			),
		).toBe(true);
	});

	it('does not retry', async () => {
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
