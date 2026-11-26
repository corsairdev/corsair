import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import { recordRequestFacts } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { badRequest } from './test-fixtures';

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
	// unknown: each case passes one of More Trees' error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string; replayable?: boolean } = {},
) {
	const method = (options.method ?? 'GET') as 'GET';
	const error = new ApiError(
		{ method, url: '/x' },
		{ url: 'https://x', ok: false, status, statusText: '', body },
		`More Trees ${status}: failed`,
		{ retryAfter: options.retryAfter },
	);
	recordRequestFacts(error, {
		method,
		replayable: options.replayable ?? false,
	});
	return error;
}

function transportError(replayable: boolean) {
	const error = new TypeError('fetch failed');
	recordRequestFacts(error, { method: 'GET', replayable });
	return error;
}

describe('More Trees error handlers', () => {
	it('leaves 429 retries to core', async () => {
		const error = apiError(429, {}, { replayable: true });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: undefined,
		});
	});

	it('passes Retry-After on', async () => {
		const error = apiError(429, {}, { retryAfter: 4000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 4000,
		});
	});

	it('does not retry a 401 or 403', async () => {
		for (const error of [apiError(401), apiError(403)]) {
			expect(classify(error)).toBe('AUTH_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		}
	});

	it.each([400, 404, 405, 406])('does not retry a %i', async (status) => {
		const error = apiError(status, badRequest);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('retries a read that got a %i', async (status) => {
		const error = apiError(status, {}, { method: 'GET', replayable: true });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST'])('does not replay a failed %s', async (method) => {
		const error = apiError(503, {}, { method, replayable: false });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a transport failure on a read', async () => {
		const error = transportError(true);
		expect(classify(error)).toBe('TRANSPORT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a transport failure on a write', async () => {
		const error = transportError(false);
		expect(classify(error)).toBe('DEFAULT');
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

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

	it('lets a caller override DEFAULT and keeps it last', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('returns the builtin handlers unchanged when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
