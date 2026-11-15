import type { CorsairErrorHandler } from 'corsair/core';
import { QuadernoAPIError, QuadernoTransportError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type Strategy = {
	maxRetries?: number;
	retryStrategy?: string;
	headersRetryAfterMs?: number;
};

/** Runs the first handler whose match passes, the way core does. */
async function resolve(
	error: Error,
	handlers: CorsairErrorHandler = errorHandlers,
): Promise<Strategy> {
	const context = {
		pluginId: 'quaderno',
		operation: 'test',
		input: {},
		originalError: error,
	};
	for (const entry of Object.values(handlers)) {
		if (!entry?.match || !entry.handler) continue;
		if (entry.match(error, context)) {
			// Safe: the strategy a handler returns only carries the retry fields
			// read here; core's type is the wider RetryStrategy.
			return (await entry.handler(error, context)) as Strategy;
		}
	}
	throw new Error('No handler matched, and DEFAULT matches everything');
}

function apiError(options: {
	status?: number;
	method?: string;
	operation?: string;
	retryAfter?: number;
	kind?: QuadernoAPIError['kind'];
}) {
	return new QuadernoAPIError('boom', options);
}

describe('errorHandlers', () => {
	it('does not retry a wrong key', async () => {
		expect(
			await resolve(
				apiError({ status: 401, method: 'GET', kind: 'unauthorized' }),
			),
		).toEqual({ maxRetries: 0 });
	});

	/**
	 * A missing record answers 401 too. It is a separate handler so the two are
	 * never confused, and neither is retried.
	 */
	it('does not retry a missing record', async () => {
		expect(
			await resolve(
				apiError({ status: 401, method: 'GET', kind: 'not_found_or_denied' }),
			),
		).toEqual({ maxRetries: 0 });
	});

	it('does not retry a validation failure on 400, 406 or 422', async () => {
		for (const status of [400, 406, 422]) {
			expect(
				await resolve(
					apiError({ status, method: 'POST', kind: 'invalid_input' }),
				),
			).toEqual({ maxRetries: 0 });
		}
	});

	it('does not retry a 405, which is how Quaderno refuses a document delete', async () => {
		expect(
			await resolve(
				apiError({ status: 405, method: 'DELETE', kind: 'conflict' }),
			),
		).toEqual({ maxRetries: 0 });
	});

	it('does not retry a zod parse failure', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';
		expect(await resolve(zodError)).toEqual({ maxRetries: 0 });
	});

	it('retries a 429 with the wait the provider reported', async () => {
		const strategy = await resolve(
			apiError({ status: 429, method: 'GET', retryAfter: 15_000 }),
		);
		expect(strategy.maxRetries).toBe(3);
		expect(strategy.headersRetryAfterMs).toBe(15_000);
		expect(strategy.retryStrategy).toBe('exponential_backoff');
	});

	it('falls back to a short wait when a 429 carries no timing', async () => {
		const strategy = await resolve(apiError({ status: 429, method: 'GET' }));
		expect(strategy.maxRetries).toBe(3);
		expect(strategy.headersRetryAfterMs).toBe(1000);
	});

	it('replays a 5xx on a read', async () => {
		const strategy = await resolve(
			apiError({ status: 503, method: 'GET', operation: 'contacts.list' }),
		);
		expect(strategy.maxRetries).toBe(2);
	});

	/**
	 * The four deliver routes are GETs that send email. A retry mails the
	 * customer twice, so a GET is not enough to call one replayable.
	 */
	it('never replays a delivery, even though it is a GET', async () => {
		for (const operation of [
			'invoices.deliver',
			'receipts.deliver',
			'credits.deliver',
			'proformas.deliver',
		]) {
			expect({
				operation,
				strategy: await resolve(
					apiError({ status: 503, method: 'GET', operation }),
				),
			}).toEqual({ operation, strategy: { maxRetries: 0 } });
		}
	});

	it('never replays a delivery that failed at the transport', async () => {
		// A dropped connection on a deliver still must not be retried: the first
		// call may have sent the email before the connection broke.
		const error = new QuadernoTransportError(
			'reset',
			'network',
			'GET',
			'invoices.deliver',
		);
		expect(await resolve(error)).toEqual({ maxRetries: 0 });
	});

	it('does replay a read that failed at the transport', async () => {
		const error = new QuadernoTransportError(
			'reset',
			'network',
			'GET',
			'contacts.list',
		);
		expect(await resolve(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never replays a delivery that failed with a server error', async () => {
		// A deliver is a GET, but the 5xx handler must not treat it as a read.
		const deliveryError = new QuadernoAPIError('boom', {
			status: 503,
			method: 'GET',
			operation: 'invoices.deliver',
		});
		expect(await resolve(deliveryError)).toEqual({ maxRetries: 0 });
	});

	it('never replays a 5xx on a write', async () => {
		for (const method of ['POST', 'PUT', 'DELETE']) {
			expect(await resolve(apiError({ status: 500, method }))).toEqual({
				maxRetries: 0,
			});
		}
	});

	it('replays a transport failure on a read', async () => {
		const strategy = await resolve(
			new QuadernoTransportError('reset', 'network', 'GET'),
		);
		expect(strategy.maxRetries).toBe(2);
	});

	it('does not replay a transport failure on a write', async () => {
		expect(
			await resolve(new QuadernoTransportError('reset', 'network', 'POST')),
		).toEqual({ maxRetries: 0 });
	});

	it('does not replay a timeout, even on a read', async () => {
		expect(
			await resolve(new QuadernoTransportError('timed out', 'timeout', 'GET')),
		).toEqual({ maxRetries: 0 });
	});

	it('does not retry an unrecognised error', async () => {
		expect(await resolve(new Error('something else'))).toEqual({
			maxRetries: 0,
		});
	});
});

describe('mergeErrorHandlers', () => {
	const builtin: CorsairErrorHandler = {
		A: { match: () => false, handler: async () => ({ maxRetries: 1 }) },
		DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
	};

	it('returns the builtin map when the caller adds nothing', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('puts a caller handler ahead of the builtin default', async () => {
		const merged = mergeErrorHandlers(builtin, {
			CUSTOM: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
		});
		expect(await resolve(new Error('x'), merged)).toEqual({ maxRetries: 0 });
	});

	it('keeps DEFAULT last', () => {
		const merged = mergeErrorHandlers(builtin, {
			ZEBRA: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('lets a caller DEFAULT replace the builtin one', async () => {
		const merged = mergeErrorHandlers(builtin, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 7 }) },
		});
		expect(await resolve(new Error('x'), merged)).toEqual({ maxRetries: 7 });
	});

	it('keeps every builtin handler the caller did not name', () => {
		const merged = mergeErrorHandlers(builtin, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});
		expect(merged.A).toBe(builtin.A);
	});

	it('lets a caller override a builtin by name', async () => {
		const merged = mergeErrorHandlers(builtin, {
			A: { match: () => true, handler: async () => ({ maxRetries: 5 }) },
		});
		expect(await resolve(new Error('x'), merged)).toEqual({ maxRetries: 5 });
	});

	it('merges the shipped handlers without losing DEFAULT', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			SOMETHING: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(Object.keys(merged)).toContain('RATE_LIMIT_ERROR');
	});
});
