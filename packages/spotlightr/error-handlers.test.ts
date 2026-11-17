import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import { SpotlightrAPIError } from './client';
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
	options: { retryAfter?: number; method?: string; url?: string } = {},
) {
	return new ApiError(
		{
			method: (options.method ?? 'GET') as 'GET',
			url: options.url ?? 'api/videos',
		},
		{
			url: `https://api.spotlightr.com/${options.url ?? 'api/videos'}`,
			ok: false,
			status,
			statusText: '',
			body: 'failed',
		},
		`Spotlightr ${status}: failed`,
		{ retryAfter: options.retryAfter },
	);
}

describe('Spotlightr error handlers', () => {
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
		expect(await strategy(apiError(429, { retryAfter: 3000 }))).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401, whether the key is missing or wrong', async () => {
		expect(classify(apiError(401))).toBe('AUTH_ERROR');
		expect(await strategy(apiError(401))).toEqual({ maxRetries: 0 });
	});

	it.each([400, 403, 404, 405])('does not retry a %i', (status) => {
		expect(classify(apiError(status))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a Zod rejection', () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx on a read', async () => {
		const error = apiError(503, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 5xx on a write', () => {
		// createVideo and the uploads are not idempotent.
		expect(classify(apiError(500, { method: 'POST' }))).toBe('DEFAULT');
	});

	it('does not replay a 5xx on the videoSource GET, which writes', () => {
		expect(
			classify(apiError(500, { method: 'GET', url: 'api/videoSource' })),
		).toBe('DEFAULT');
	});

	it('does not replay a transport failure that never got a status', () => {
		expect(
			classify(new SpotlightrAPIError('fetch failed', { method: 'GET' })),
		).toBe('DEFAULT');
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
			RATE_LIMIT_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(
			await merged.RATE_LIMIT_ERROR?.handler(new Error('x'), {} as never),
		).toEqual({ maxRetries: 1 });
	});

	it('returns the builtin map unchanged when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
