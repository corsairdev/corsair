import { ZodError } from 'zod';
import { NanonetsAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	error400,
	error402,
	error404,
	error429,
	plainTextError,
} from './test-fixtures';

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

// unknown: each case passes one of Nanonets's documented error bodies.
function apiError(
	status: number,
	body: unknown = {},
	options: { retryAfter?: number; replaySafe?: boolean } = {},
) {
	return new NanonetsAPIError(`Nanonets ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('Nanonets error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429, error429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After when Nanonets sends one', async () => {
		const error = apiError(429, error429, { retryAfter: 2000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([['replay-safe'], ['not replay-safe']])(
		'retries a rate-limited request that is %s, because it never ran',
		async (label) => {
			const error = apiError(429, error429, {
				replaySafe: label === 'replay-safe',
			});
			expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		},
	);

	it('does not retry a 402 quota exhaustion', async () => {
		const viaStatus = apiError(402, error402);
		expect(viaStatus.isQuotaExhausted).toBe(true);
		expect(classify(viaStatus)).toBe('QUOTA_ERROR');
		expect(await strategy(viaStatus)).toEqual({ maxRetries: 0 });

		// The matcher reads the isQuotaExhausted getter, not the raw status.
		const viaGetter = apiError(402);
		expect(viaGetter.isQuotaExhausted).toBe(true);
		expect(classify(viaGetter)).toBe('QUOTA_ERROR');
	});

	it('does not retry a 401 for a bad key', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403 for a forbidden model or operation', async () => {
		const error = apiError(403);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404 for a missing model or file', async () => {
		const error = apiError(404, error404);
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 400 for a missing file', async () => {
		const error = apiError(400, error400);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a plain-text 400', async () => {
		const error = apiError(400, plainTextError);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 503])(
		'retries a replay-safe read that got a %i',
		async (status) => {
			const error = apiError(status, {}, { replaySafe: true });
			expect(classify(error)).toBe('SERVER_ERROR');
			expect(await strategy(error)).toEqual({
				maxRetries: 2,
				retryStrategy: 'exponential_backoff',
			});
		},
	);

	it.each([
		['a prediction upload', false],
		['a training call', false],
	])('does not replay %s on a 5xx', async (_label, replaySafe) => {
		const error = apiError(500, {}, { replaySafe });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a prediction that timed out', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		const error = new NanonetsAPIError(timeout.message, { cause: timeout });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps DEFAULT last when caller handlers are merged', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});

	it('returns the builtin handlers when no caller handlers are given', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('lets a caller handler fire before an overlapping builtin', async () => {
		const custom = {
			MAINTENANCE: {
				match: (error: Error) =>
					error instanceof NanonetsAPIError && error.status === 503,
				handler: async () => ({ maxRetries: 5 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);
		const error = apiError(503);
		expect(
			(Object.keys(merged) as HandlerName[]).find((key) =>
				merged[key]?.match(error, {} as never),
			),
		).toBe('MAINTENANCE');
	});
});
