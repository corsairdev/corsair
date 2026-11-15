import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import {
	errorHandlers,
	mergeErrorHandlers,
	TombaOperationError,
} from './error-handlers';
import { insufficientCredits, legalBlock, noKey } from './test-fixtures';

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
	// The builtin handlers read only the error.
	return errorHandlers[classify(error)].handler(error, {} as never);
}

// The error core's request() throws, as the client passes it on.
function apiError(
	status: number,
	options: { type?: string; retryAfter?: number; method?: string } = {},
) {
	return new ApiError(
		{ method: (options.method ?? 'GET') as 'GET', url: 'me' },
		{
			url: 'https://api.tomba.io/v1/me',
			ok: false,
			status,
			statusText: 'failed',
			body: options.type ? { errors: { type: options.type } } : {},
		},
		`Tomba ${status}: failed`,
		{ retryAfter: options.retryAfter },
	);
}

describe('Tomba error handlers', () => {
	it('retries a window 429 after Retry-After', async () => {
		const error = apiError(429, { retryAfter: 30000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 30000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 429 that says the daily limit is used up', async () => {
		const error = new ApiError(
			{ method: 'GET', url: 'email-finder' },
			{
				url: 'https://api.tomba.io/v1/email-finder',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {
					errors: {
						type: 'rate_limit',
						message: 'Rate limit exceeded (daily). Limit is 5 requests.',
					},
				},
			},
			'Tomba 429 rate_limit',
			{ retryAfter: 40_000_000 },
		);
		expect(classify(error)).toBe('QUOTA_EXHAUSTED_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 402, which is an empty balance', async () => {
		const error = apiError(402);
		expect(classify(error)).toBe('INSUFFICIENT_BALANCE_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an insufficient_credits type on another status', () => {
		expect(classify(apiError(400, { type: 'insufficient_credits' }))).toBe(
			'INSUFFICIENT_BALANCE_ERROR',
		);
	});

	it('checks the balance before the rate limit, since a 429 can mean both', () => {
		// Ordering matters: core takes the first matching key. A credit error
		// that also carried a 429 must not be retried three times.
		const error = apiError(429, { type: 'quota_exceeded' });
		expect(classify(error)).toBe('INSUFFICIENT_BALANCE_ERROR');
	});

	it('does not retry a 451 or a legal_block', () => {
		expect(classify(apiError(451))).toBe('LEGAL_BLOCK_ERROR');
		expect(classify(apiError(400, { type: 'legal_block' }))).toBe(
			'LEGAL_BLOCK_ERROR',
		);
	});

	it('treats a 400 authentication_failed as an auth error', async () => {
		// A missing credential answers 400, not 401.
		const error = apiError(400, { type: 'authentication_failed' });
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats a 401 as an auth error even with no type', () => {
		expect(classify(apiError(401))).toBe('AUTH_ERROR');
	});

	it('does not retry a 403', () => {
		expect(classify(apiError(403))).toBe('PERMISSION_ERROR');
	});

	it.each([400, 422])('does not retry a bare %i', (status) => {
		expect(classify(apiError(status))).toBe('VALIDATION_ERROR');
	});

	it('treats unknown_record as a validation error, which it is', () => {
		expect(classify(apiError(400, { type: 'unknown_record' }))).toBe(
			'VALIDATION_ERROR',
		);
	});

	it('does not retry a Zod rejection', () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('does not retry an incomplete-credential refusal', () => {
		expect(classify(new TombaOperationError('secret missing'))).toBe(
			'VALIDATION_ERROR',
		);
	});

	it('retries a 5xx on a read, which the docs say to', async () => {
		const error = apiError(500, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('replays the POST company search on a 5xx, since it only reads', () => {
		expect(classify(apiError(500, { method: 'POST' }))).toBe('SERVER_ERROR');
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
		const cases: [Error, HandlerName][] = [
			[apiError(400, { type: noKey.errors.type }), 'AUTH_ERROR'],
			[
				apiError(402, { type: insufficientCredits.errors.type }),
				'INSUFFICIENT_BALANCE_ERROR',
			],
			[apiError(451, { type: legalBlock.errors.type }), 'LEGAL_BLOCK_ERROR'],
		];
		for (const [error, expected] of cases) {
			expect(classify(error)).toBe(expected);
		}
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
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(
			await merged.AUTH_ERROR?.handler(new Error('x'), {} as never),
		).toEqual({
			maxRetries: 1,
		});
	});

	it('returns the builtin map unchanged when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
