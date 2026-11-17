import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import { TwelveDataAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { badKey, planLimit, symbolNotFound } from './test-fixtures';

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
	options: { retryAfter?: number; code?: number } = {},
) {
	return new TwelveDataAPIError(`Twelve Data ${status}`, {
		status,
		...options,
	});
}

describe('Twelve Data error handlers', () => {
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
		expect(await strategy(apiError(429, { retryAfter: 6000 }))).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 6000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403 plan limit', async () => {
		const error = apiError(403);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404])('does not retry a %i', (status) => {
		expect(classify(apiError(status))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a Zod rejection', () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a 200 body that said error', () => {
		// assertOk builds the error with the provider's code and no HTTP status.
		const error = new TwelveDataAPIError('market.quote was refused', {
			code: symbolNotFound.code,
		});
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx, since every route is a read', async () => {
		const error = apiError(503);
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('leaves anything unrecognised to DEFAULT with no retry', async () => {
		expect(classify(new Error('socket hang up'))).toBe('DEFAULT');
		expect(await strategy(new Error('socket hang up'))).toEqual({
			maxRetries: 0,
		});
	});

	it('keeps DEFAULT last in the builtin map', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});

	it('classifies the live error bodies', () => {
		expect(classify(apiError(badKey.code))).toBe('AUTH_ERROR');
		expect(classify(apiError(planLimit.code))).toBe('PERMISSION_ERROR');
	});
});

// unknown: the provider's error body is arbitrary JSON.
function coreError(status: number, body: unknown, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: 'quote' },
		{
			url: 'https://api.twelvedata.com/quote',
			ok: false,
			status,
			statusText: String(status),
			body,
		},
		String(status),
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Twelve Data error handlers on core ApiError', () => {
	it('retries a per-minute 429 and keeps its Retry-After', async () => {
		const error = coreError(
			429,
			{
				code: 429,
				message: 'You have run out of API credits for the current minute.',
			},
			6000,
		);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 6000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 429 for the used-up daily credits', async () => {
		const error = coreError(429, {
			code: 429,
			message: 'You have run out of API credits for the day.',
		});
		expect(classify(error)).toBe('QUOTA_EXHAUSTED_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry daily or monthly quota-exhausted messages', () => {
		for (const message of [
			'daily quota exhausted',
			'monthly quota exhausted',
			'You have run out of API credits for the month.',
		]) {
			expect(classify(coreError(429, { code: 429, message }))).toBe(
				'QUOTA_EXHAUSTED_ERROR',
			);
		}
	});

	it('routes 401, 403 and 5xx by status', () => {
		expect(classify(coreError(401, badKey))).toBe('AUTH_ERROR');
		expect(classify(coreError(403, planLimit))).toBe('PERMISSION_ERROR');
		expect(classify(coreError(502, '<html>'))).toBe('SERVER_ERROR');
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps a caller handler reachable when the builtin has no match for it', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => true, handler: async () => ({ maxRetries: 7 }) },
		});

		const first = Object.keys(merged).find((key) =>
			merged[key as keyof typeof merged]?.match(new Error('x'), {} as never),
		);
		expect(first).toBe('CUSTOM');
	});

	it('keeps the caller DEFAULT last and winning', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(await merged.DEFAULT?.handler(new Error('x'), {} as never)).toEqual({
			maxRetries: 9,
		});
	});

	it('lets a caller override a builtin name', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			SERVER_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(
			await merged.SERVER_ERROR?.handler(new Error('x'), {} as never),
		).toEqual({ maxRetries: 1 });
	});

	it('returns the builtin map unchanged when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
