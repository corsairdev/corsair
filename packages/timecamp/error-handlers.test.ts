/**
 * Error policy.
 *
 * `makeTimecampRequest` wraps ApiError in TimecampAPIError, so these assert the
 * handlers read status and Retry-After off the *wrapper*. Matching on
 * `instanceof ApiError` here would silently never fire.
 */
import { TimecampAPIError } from './client';
import { errorHandlers } from './error-handlers';

/** Builds the error shape the client actually throws. */
function wrapped(
	status: number,
	message = 'request failed',
	retryAfter?: number,
) {
	const error = new TimecampAPIError(message, status);
	Object.assign(error, { status, retryAfter });
	return error as Error;
}

describe('rate limiting', () => {
	it('matches a wrapped 429 by status, not by message text', () => {
		// Message deliberately omits "429" — status alone must be enough.
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped(429, 'too many'))).toBe(
			true,
		);
	});

	it('surfaces the provider Retry-After instead of generic backoff', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			wrapped(429, 'too many', 30_000),
		);
		expect(result.headersRetryAfterMs).toBe(30_000);
	});

	it('still retries a rate limit when the status is absent', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('HTTP 429 returned')),
		).toBe(true);
	});

	it('does not treat an unrelated failure as a rate limit', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped(500))).toBe(false);
	});
});

describe('auth and plan failures', () => {
	it('matches a wrapped 401', () => {
		expect(errorHandlers.AUTH_ERROR.match(wrapped(401))).toBe(true);
	});

	it('never retries an auth failure', async () => {
		expect((await errorHandlers.AUTH_ERROR.handler()).maxRetries).toBe(0);
	});

	it('matches the 403 a free-plan account receives', () => {
		expect(errorHandlers.PLAN_OR_PERMISSION_ERROR.match(wrapped(403))).toBe(
			true,
		);
	});

	it('never retries a plan failure, since it cannot resolve itself', async () => {
		expect(
			(await errorHandlers.PLAN_OR_PERMISSION_ERROR.handler()).maxRetries,
		).toBe(0);
	});
});

describe('server errors', () => {
	it('retries a 5xx', () => {
		expect(errorHandlers.SERVER_ERROR.match(wrapped(503))).toBe(true);
	});

	it('does not classify a 4xx as a server error', () => {
		expect(errorHandlers.SERVER_ERROR.match(wrapped(404))).toBe(false);
	});
});

describe('fallback', () => {
	it('catches anything unclassified without retrying', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		expect((await errorHandlers.DEFAULT.handler()).maxRetries).toBe(0);
	});
});
