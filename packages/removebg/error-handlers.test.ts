import { RemovebgAPIError } from './client';
import { errorHandlers } from './error-handlers';

// makeRemovebgRequest always wraps transport failures into RemovebgAPIError
// before they reach these handlers, so `instanceof ApiError` would never
// match here — these tests guard against that regression.

describe('RATE_LIMIT_ERROR', () => {
	it('matches a 429 RemovebgAPIError and forwards its retryAfter', async () => {
		const error = new RemovebgAPIError(
			'Too Many Requests',
			undefined,
			429,
			5000,
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 5000,
		});
	});
});

describe('AUTH_ERROR', () => {
	it('matches a 403 RemovebgAPIError (remove.bg uses 403 for a bad key)', () => {
		const error = new RemovebgAPIError('Forbidden', undefined, 403);

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});
});

describe('INSUFFICIENT_CREDITS_ERROR', () => {
	it('matches a 402 RemovebgAPIError', () => {
		const error = new RemovebgAPIError('Payment Required', undefined, 402);

		expect(errorHandlers.INSUFFICIENT_CREDITS_ERROR.match(error)).toBe(true);
	});

	it('does not classify an unrelated error as insufficient credits', () => {
		const error = new RemovebgAPIError('Internal Server Error', undefined, 500);

		expect(errorHandlers.INSUFFICIENT_CREDITS_ERROR.match(error)).toBe(false);
	});
});
