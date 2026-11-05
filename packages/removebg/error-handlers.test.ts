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
			maxRetries: 0,
			headersRetryAfterMs: 5000,
		});
	});

	it('does not treat a 500 as a rate limit just because the message mentions 429', () => {
		const error = new RemovebgAPIError('upstream 429', undefined, 500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
	});

	it('still matches a rate-limit message when no HTTP status is present', () => {
		const error = new RemovebgAPIError('rate_limited');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('does not treat a plain Error with a status field as a rate limit', () => {
		const error = Object.assign(new Error('nope'), { status: 429 });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
	});
});

describe('AUTH_ERROR', () => {
	it('matches a 403 RemovebgAPIError (remove.bg uses 403 for a bad key)', () => {
		const error = new RemovebgAPIError('Forbidden', undefined, 403);

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('matches a 401 RemovebgAPIError', () => {
		const error = new RemovebgAPIError('Unauthorized', undefined, 401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('does not treat a 500 as auth failure just because the message mentions unauthorized', () => {
		const error = new RemovebgAPIError('unauthorized backend', undefined, 500);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
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
