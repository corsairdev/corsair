import { ZodError } from 'zod';
import { OpengraphAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	blockedError,
	flatError,
	nestedError,
	oembedResolutionError,
	rateLimitError,
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

function apiError(
	status: number,
	// unknown: each case passes one of OpenGraph.io's error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new OpengraphAPIError(`OpenGraph.io ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('OpenGraph.io error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429, rateLimitError);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([['GET'], ['POST']])(
		'retries a rate-limited %s, which never ran',
		async (method) => {
			const error = apiError(429, rateLimitError, { method });
			expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		},
	);

	it('honours Retry-After when OpenGraph.io sends one', async () => {
		const error = apiError(429, rateLimitError, { retryAfter: 2000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401 for a bad App ID', async () => {
		const error = apiError(401, flatError);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403 for a blocked target site', async () => {
		const error = apiError(403, blockedError);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([
		['markdown -2201', nestedError],
		['oembed resolution failed', oembedResolutionError],
	])('does not retry a 422 for %s', async (_label, body) => {
		const error = apiError(422, body);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('retries a read that got a %i', async (status) => {
		const error = apiError(status, {}, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a failed POST, which would bill twice', async () => {
		const error = apiError(500, {}, { method: 'POST' });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a brand analysis POST that timed out', async () => {
		const error = apiError(
			504,
			{ error: { code: -4100, message: 'timed out' } },
			{ method: 'POST' },
		);
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

	it('lets a caller handler win over a builtin with another name', async () => {
		const custom = {
			BLOCKED: {
				match: (error: Error) =>
					error instanceof OpengraphAPIError && error.status === 403,
				handler: async () => ({ maxRetries: 5 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);
		// PERMISSION_ERROR also matches 403 but user keys order before builtin
		// keys only by insertion; the builtin keeps its name, so prove the
		// custom handler is present and reachable.
		expect(merged.BLOCKED).toBeDefined();
		const error = apiError(403, blockedError);
		expect(
			(Object.keys(merged) as HandlerName[]).find((key) =>
				merged[key]?.match(error, {} as never),
			),
		).toBe('BLOCKED');
	});
});
