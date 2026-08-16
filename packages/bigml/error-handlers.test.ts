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

	it('falls back to DEFAULT for a genuinely unrecognised status', () => {
		// 418 - not 4xx (401/403/404) and not 5xx, so nothing else should claim it.
		const error = new BigmlAPIError("I'm a teapot", 418);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(false);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});

	it('retries a 5xx with a bounded exponential backoff', async () => {
		const error = new BigmlAPIError('upstream exploded', 503);
		expect(
			errorHandlers.SERVER_ERROR.match(error, {
				pluginId: 'bigml',
				operation: 'sources.list',
				input: {},
				originalError: error,
			}),
		).toBe(true);

		const result = await errorHandlers.SERVER_ERROR.handler();
		expect(result.maxRetries).toBeGreaterThan(0);
		expect(result.retryStrategy).toBe('exponential_backoff');
	});

	/**
	 * `projects.create` and `externalConnectors.create` are the only two
	 * non-idempotent `POST` operations in this plugin. A 5xx there can mean
	 * BigML processed the request and only the response was lost - blindly
	 * retrying would create a second, real, duplicate resource. This is the
	 * one case `SERVER_ERROR` must refuse to match regardless of status.
	 */
	it('never retries a 5xx on a create operation, to avoid duplicating a resource', () => {
		const error = new BigmlAPIError('upstream exploded', 503);
		expect(
			errorHandlers.SERVER_ERROR.match(error, {
				pluginId: 'bigml',
				operation: 'projects.create',
				input: {},
				originalError: error,
			}),
		).toBe(false);
		expect(
			errorHandlers.SERVER_ERROR.match(error, {
				pluginId: 'bigml',
				operation: 'externalConnectors.create',
				input: {},
				originalError: error,
			}),
		).toBe(false);
	});

	/**
	 * Fails closed, not open: with no `context` at all (the shape a direct
	 * `.match(error)` call has, as every other test in this file uses), there
	 * is no way to confirm the failing call wasn't a create - so it must not
	 * retry, the same reasoning as the explicit `.create` exclusion above.
	 */
	it('does not retry a 5xx when no operation context is available', () => {
		const error = new BigmlAPIError('upstream exploded', 503);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(false);
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
