import { ZodError } from 'zod';
import { GumroadAPIError } from './client';
import { errorHandlers } from './error-handlers';

type HandlerName = keyof typeof errorHandlers;
type Handler = (typeof errorHandlers)[HandlerName];

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	return errorHandlers[classify(error)].handler(error);
}

function apiError(
	status: number,
	options: { retryAfter?: number; method?: string } = {},
) {
	return new GumroadAPIError(`Gumroad ${status}: failed`, {
		status,
		retryAfter: options.retryAfter,
		method: options.method ?? 'GET',
		body: { success: false, message: 'failed' },
	});
}

describe('Gumroad error handlers', () => {
	it('dispatches in key order with DEFAULT last, so a reorder fails', () => {
		// If DEFAULT were not last, a 429 or 500 would silently fall through
		// to it and never retry.
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
		const { DEFAULT, ...rest } = errorHandlers;
		const reordered: Record<string, Handler> = { DEFAULT, ...rest };
		// First-match dispatch over the reordered keys stops at DEFAULT for
		// every error, which is exactly the bug the shipped order prevents.
		expect(
			Object.keys(reordered).find((key) =>
				reordered[key]?.match(apiError(429)),
			),
		).toBe('DEFAULT');
		expect(classify(apiError(429))).toBe('RATE_LIMIT_ERROR');
	});

	it('does not retry a 400 or a local ZodError', async () => {
		expect(classify(apiError(400))).toBe('VALIDATION_ERROR');
		const zodError = new ZodError([]);
		expect(classify(zodError)).toBe('VALIDATION_ERROR');
		expect(await strategy(zodError)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401, 402, 403 or 404', async () => {
		expect(classify(apiError(401))).toBe('AUTH_ERROR');
		expect(classify(apiError(402))).toBe('REQUEST_FAILED_ERROR');
		expect(classify(apiError(403))).toBe('PERMISSION_ERROR');
		expect(classify(apiError(404))).toBe('NOT_FOUND_ERROR');
		for (const status of [401, 402, 403, 404]) {
			expect(await strategy(apiError(status))).toEqual({ maxRetries: 0 });
		}
	});

	it('retries a 429 three times honoring a capped, jittered Retry-After', async () => {
		const error = apiError(429, { retryAfter: 3000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		const result = await strategy(error);
		expect(result.maxRetries).toBe(3);
		expect(result).toMatchObject({ retryStrategy: 'exponential_backoff' });
		if (!('headersRetryAfterMs' in result)) {
			throw new Error('429 handler must return headersRetryAfterMs');
		}
		expect(result.headersRetryAfterMs).toBeGreaterThanOrEqual(3000);
		expect(result.headersRetryAfterMs).toBeLessThan(3250);
	});

	it('caps an oversized Retry-After at sixty seconds', async () => {
		const result = await strategy(apiError(429, { retryAfter: 600_000 }));
		if (!('headersRetryAfterMs' in result)) {
			throw new Error('429 handler must return headersRetryAfterMs');
		}
		expect(result.headersRetryAfterMs).toBeLessThanOrEqual(60_250);
	});

	it('backs off on a 429 without Retry-After', async () => {
		const result = await strategy(apiError(429));
		expect(result).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a 5xx on a GET read twice', async () => {
		for (const status of [500, 502, 503]) {
			expect(classify(apiError(status, { method: 'GET' }))).toBe(
				'SERVER_ERROR',
			);
		}
		expect(await strategy(apiError(503, { method: 'GET' }))).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never replays a 5xx on the POST licenses.verify call', async () => {
		const error = apiError(503, { method: 'POST' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('never replays a 5xx on PUT or DELETE writes either', async () => {
		for (const method of ['PUT', 'DELETE']) {
			const error = apiError(503, { method });
			expect(classify(error)).toBe('SERVER_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		}
	});

	it('falls through unknown errors to DEFAULT without retrying', async () => {
		const error = new GumroadAPIError('Gumroad request failed: unknown');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});
