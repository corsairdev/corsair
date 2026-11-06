import { ZodError } from 'zod';
import { TicketmasterAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	invalidApiKey,
	invalidParameter,
	missingApiKey,
	quotaExceeded,
	searchNotFound,
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
	// unknown: each case passes one of Ticketmaster's error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new TicketmasterAPIError(`Ticketmaster ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('Ticketmaster error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429, quotaExceeded);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After when Ticketmaster sends one', async () => {
		const error = apiError(429, quotaExceeded, { retryAfter: 2000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a 429 even without the documented body', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
	});

	it.each([
		['the invalid-key fault', invalidApiKey],
		['the missing-key fault', missingApiKey],
	])('does not retry a 401 with %s', async (_, body) => {
		const error = apiError(401, body);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 400 for a rejected parameter', async () => {
		const error = apiError(400, invalidParameter);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404 for an unknown ID', async () => {
		const error = apiError(404, searchNotFound);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403 from a key without Discovery access', async () => {
		const error = apiError(403);
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

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a network failure with no status', async () => {
		const error = new TicketmasterAPIError('fetch failed', { method: 'GET' });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps DEFAULT last when a caller adds a handler', () => {
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

	it("keeps the caller's DEFAULT last when they replace it", () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(merged.DEFAULT).toMatchObject({ handler: expect.any(Function) });
	});

	it('returns the built-ins unchanged when there is nothing to merge', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
