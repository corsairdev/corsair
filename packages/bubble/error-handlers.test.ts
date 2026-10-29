/** Covers how each Bubble failure is classified for retry. */
import { BubbleAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('errorHandlers', () => {
	it('retries a 429 on idempotent reads only (transport does not retry)', async () => {
		const error = new BubbleAPIError('rate limited', 429);
		(error as { retryAfter?: number }).retryAfter = 2000;

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const noOp = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(noOp.maxRetries).toBe(0);

		const getRetry = await errorHandlers.RATE_LIMIT_ERROR.handler(error, {
			pluginId: 'bubble',
			operation: 'things.get',
			input: {},
			originalError: error,
		});
		expect(getRetry.maxRetries).toBeGreaterThan(0);
		expect(getRetry.headersRetryAfterMs).toBe(2000);

		const createRetry = await errorHandlers.RATE_LIMIT_ERROR.handler(error, {
			pluginId: 'bubble',
			operation: 'things.create',
			input: {},
			originalError: error,
		});
		expect(createRetry.maxRetries).toBe(0);
	});

	it('never retries a 401', async () => {
		const error = new BubbleAPIError('unauthorized', 401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('never retries a 403', () => {
		const forbidden = new BubbleAPIError('forbidden', 403);
		expect(errorHandlers.PERMISSION_ERROR.match(forbidden)).toBe(true);
	});

	it('never retries a 404', () => {
		const error = new BubbleAPIError('not found', 404);
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
		const error = new BubbleAPIError('bad request', 400);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(false);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});

	it('retries a 5xx with a bounded exponential backoff', async () => {
		const error = new BubbleAPIError('upstream exploded', 503);
		expect(
			errorHandlers.SERVER_ERROR.match(error, {
				pluginId: 'bubble',
				operation: 'things.get',
				input: {},
				originalError: error,
			}),
		).toBe(true);

		const result = await errorHandlers.SERVER_ERROR.handler();
		expect(result.maxRetries).toBeGreaterThan(0);
		expect(result.retryStrategy).toBe('exponential_backoff');
	});

	/**
	 * `things.create`, `things.bulkCreate`, and `workflows.run` are the only
	 * non-idempotent POST operations in this plugin. A 5xx there can mean
	 * Bubble processed the request and only the response was lost - blindly
	 * retrying would create a second, real, duplicate thing or workflow run.
	 * This is the one case `SERVER_ERROR` must refuse to match regardless of
	 * status.
	 */
	it('never retries a 5xx on a create/bulkCreate/run operation, to avoid duplicating work', () => {
		const error = new BubbleAPIError('upstream exploded', 503);
		for (const operation of [
			'things.create',
			'things.bulkCreate',
			'workflows.run',
			'workflows.runGet',
		]) {
			expect(
				errorHandlers.SERVER_ERROR.match(error, {
					pluginId: 'bubble',
					operation,
					input: {},
					originalError: error,
				}),
			).toBe(false);
		}
	});

	/**
	 * Fails closed, not open: with no `context` at all (the shape a direct
	 * `.match(error)` call has), there is no way to confirm the failing call
	 * wasn't a create - so it must not retry, the same reasoning as the
	 * explicit `.create` exclusion above.
	 */
	it('does not retry a 5xx when no operation context is available', () => {
		const error = new BubbleAPIError('upstream exploded', 503);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(false);
	});

	/**
	 * Every error this plugin's transport throws is already a `BubbleAPIError`
	 * with a real numeric status (see `client.ts`'s catch block) - the
	 * message-text fallback branches are unreachable in production. This
	 * proves a status-bearing error never falls through to message-sniffing,
	 * even when its message happens to contain a trigger word for a
	 * *different* status.
	 */
	it('never message-sniffs a status-bearing error, even if the message contains a trigger word for another status', () => {
		const serverErrorMentioningAuth = new BubbleAPIError(
			'upstream said: 401 unauthorized while proxying',
			500,
		);
		expect(errorHandlers.AUTH_ERROR.match(serverErrorMentioningAuth)).toBe(
			false,
		);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});
