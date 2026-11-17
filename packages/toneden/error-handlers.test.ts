import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
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
			url: 'https://www.toneden.io/api/v1/x',
			ok: false,
			status,
			statusText: '',
			body: {},
		},
		`ToneDen ${status}: failed`,
		{ retryAfter: options.retryAfter },
	);
}

describe('ToneDen error handlers', () => {
	it('leaves 429 retries to core, which already retried with Retry-After', async () => {
		const error = apiError(429, { retryAfter: 20000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403', async () => {
		expect(classify(apiError(403))).toBe('PERMISSION_ERROR');
	});

	it.each([400, 404, 422])('does not retry a %i', (status) => {
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

	it('does not replay a 5xx on a campaign create', () => {
		// A replay could spend budget on a second campaign.
		expect(classify(apiError(500, { method: 'POST' }))).toBe('DEFAULT');
	});

	it('does not replay a 5xx on a PUT', () => {
		expect(classify(apiError(500, { method: 'PUT' }))).toBe('DEFAULT');
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
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(
			await merged.AUTH_ERROR?.handler(new Error('x'), {} as never),
		).toEqual({ maxRetries: 1 });
	});

	it('returns the builtin map unchanged when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
