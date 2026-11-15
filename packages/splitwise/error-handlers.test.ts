import { ZodError } from 'zod';
import { SplitwiseAPIError, SplitwiseOperationError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type HandlerName = keyof typeof errorHandlers;

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
	return new SplitwiseAPIError(`Splitwise ${status}: failed`, {
		status,
		...options,
	});
}

describe('Splitwise error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After on a 429', async () => {
		const error = apiError(429, { retryAfter: 7000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 7000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403', async () => {
		const error = apiError(403);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 400', async () => {
		const error = apiError(400);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404', async () => {
		const error = apiError(404);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a Zod rejection', () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('does not retry a write the provider refused with 200', () => {
		const error = new SplitwiseOperationError('did not apply', { base: ['x'] });
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx on a read', async () => {
		const error = apiError(503, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([500, 502, 503, 504])('retries a %i on a read', (status) => {
		expect(classify(apiError(status, { method: 'GET' }))).toBe('SERVER_ERROR');
	});

	it('does not replay a 5xx on a write, which may have applied', () => {
		// create_expense is not idempotent: replaying it adds a second expense.
		const error = apiError(500, { method: 'POST' });
		expect(classify(error)).toBe('DEFAULT');
	});

	it('does not replay a 5xx whose method is unknown', () => {
		expect(classify(apiError(500))).toBe('DEFAULT');
	});

	it('leaves anything unrecognised to DEFAULT with no retry', async () => {
		const error = new Error('socket hang up');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('keeps DEFAULT last in the builtin map', () => {
		const keys = Object.keys(errorHandlers);
		expect(keys.at(-1)).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps a caller handler reachable when the builtin has no match for it', async () => {
		const { mergeErrorHandlers: merge } = await import('./error-handlers');
		const custom = jest.fn().mockResolvedValue({ maxRetries: 7 });
		const merged = merge(errorHandlers, {
			CUSTOM: { match: () => true, handler: custom },
		});

		// Core takes the first match in key order. If the builtin map were spread
		// first, DEFAULT would inherit that position and claim this error before
		// the caller's CUSTOM handler was ever consulted.
		const first = Object.keys(merged).find((key) =>
			merged[key as keyof typeof merged]?.match(new Error('x'), {} as never),
		);
		expect(first).toBe('CUSTOM');
	});

	it('keeps the caller DEFAULT last and winning', async () => {
		const callerDefault = jest.fn().mockResolvedValue({ maxRetries: 9 });
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: { match: () => true, handler: callerDefault },
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(await merged.DEFAULT?.handler(new Error('x'), {} as never)).toEqual({
			maxRetries: 9,
		});
	});

	it('lets a caller override a builtin name', async () => {
		const override = jest.fn().mockResolvedValue({ maxRetries: 1 });
		const merged = mergeErrorHandlers(errorHandlers, {
			RATE_LIMIT_ERROR: { match: () => true, handler: override },
		});

		expect(
			await merged.RATE_LIMIT_ERROR?.handler(new Error('x'), {} as never),
		).toEqual({
			maxRetries: 1,
		});
	});

	it('returns the builtin map unchanged when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
