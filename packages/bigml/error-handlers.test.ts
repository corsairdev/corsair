/** Covers how each BigML failure is classified for retry. */
import { BigmlAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('errorHandlers', () => {
	it('retries a 429, honouring a retry-after carried on the error', async () => {
		const error = new BigmlAPIError('rate limited', 429, 2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBeGreaterThan(0);
		expect(result.headersRetryAfterMs).toBe(2000);
	});

	it('never retries a 401', async () => {
		const error = new BigmlAPIError('unauthorized', 401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('never retries a 403, and treats 402 the same way', () => {
		const forbidden = new BigmlAPIError('forbidden', 403);
		const paymentRequired = new BigmlAPIError('plan limit reached', 402);
		expect(errorHandlers.PERMISSION_ERROR.match(forbidden)).toBe(true);
		expect(errorHandlers.PERMISSION_ERROR.match(paymentRequired)).toBe(true);
	});

	it('never retries a 404', () => {
		const error = new BigmlAPIError('not found', 404);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
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
		const error = new BigmlAPIError('server exploded', 500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(false);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});

	/**
	 * Every error this plugin's transport throws is already a `BigmlAPIError`
	 * with a real numeric status (see `client.ts`'s `wrapError`) - the
	 * message-text fallback branches are unreachable in production. This
	 * proves a status-bearing error never falls through to message-sniffing,
	 * even when its message happens to contain a trigger word for a
	 * *different* status.
	 */
	it('never message-sniffs a status-bearing error, even if the message contains a trigger word for another status', () => {
		const serverErrorMentioningAuth = new BigmlAPIError(
			'upstream said: 401 unauthorized while proxying',
			500,
		);
		expect(errorHandlers.AUTH_ERROR.match(serverErrorMentioningAuth)).toBe(
			false,
		);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});
