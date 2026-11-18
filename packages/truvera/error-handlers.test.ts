import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import {
	errorHandlers,
	mergeErrorHandlers,
	TruveraOperationError,
} from './error-handlers';
import { paymentRequired, unauthorized } from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

// Every handler ignores its arguments now, so it is called the way core
// calls it, with the error, through a widened signature.
async function strategy(error: Error) {
	const handler = errorHandlers[classify(error)].handler as (
		error: Error,
	) => Promise<unknown>;
	return handler(error);
}

function apiError(
	status: number,
	options: { retryAfter?: number; method?: string } = {},
) {
	// Without a method the request counts as a write, so it is never replayed.
	return new ApiError(
		{
			method: (options.method ?? 'POST') as 'GET' | 'POST',
			url: 'x',
		},
		{
			url: 'https://api.truvera.io/x',
			ok: false,
			status,
			statusText: '',
			body: {},
		},
		`Truvera ${status}: failed`,
		{ retryAfter: options.retryAfter },
	);
}

describe('Truvera error handlers', () => {
	it('leaves 429 retries to core, which already retried with Retry-After', async () => {
		const error = apiError(429, { retryAfter: 8000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 402 transaction limit', async () => {
		const error = apiError(402);
		expect(classify(error)).toBe('QUOTA_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404])('does not retry a %i', (status) => {
		expect(classify(apiError(status))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a Zod rejection', () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a plugin refusal', () => {
		expect(classify(new TruveraOperationError('password required'))).not.toBe(
			'SERVER_ERROR',
		);
	});

	it('retries a 5xx on a read', async () => {
		const error = apiError(503, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 5xx on a credential issue', () => {
		// A replay would mint a second credential.
		expect(classify(apiError(500, { method: 'POST' }))).toBe('DEFAULT');
	});

	it('does not replay a 5xx on a DELETE', () => {
		expect(classify(apiError(500, { method: 'DELETE' }))).toBe('DEFAULT');
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

	it('classifies the live error envelopes', () => {
		expect(classify(apiError(unauthorized.status))).toBe('AUTH_ERROR');
		expect(classify(apiError(paymentRequired.status))).toBe('QUOTA_ERROR');
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
			QUOTA_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(
			await merged.QUOTA_ERROR?.handler(new Error('x'), {} as never),
		).toEqual({ maxRetries: 1 });
	});

	it('returns the builtin map unchanged when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
