import { ZodError } from 'zod';
import { ESignaturesAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { errorBody } from './test-fixtures';

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
	// unknown: each case passes one of the undocumented error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new ESignaturesAPIError(`eSignatures ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('eSignatures error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429, errorBody('Slow down'));
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([
		['GET', 429],
		['POST', 429],
	])('retries a rate-limited %s, which never ran', async (method, status) => {
		const error = apiError(status, {}, { method });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('honours Retry-After when eSignatures sends one', async () => {
		const error = apiError(429, {}, { retryAfter: 2000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401 from a bad token', async () => {
		const error = apiError(401, errorBody('Invalid token'));
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403', async () => {
		const error = apiError(403, errorBody('Blocked'));
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404])('does not retry a %i', async (status) => {
		const error = apiError(status, errorBody('No such contract'));
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

	it.each(['POST'])('does not replay a failed %s', async (method) => {
		const error = apiError(500, {}, { method });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a write that timed out', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		const error = new ESignaturesAPIError(timeout.message, {
			cause: timeout,
			method: 'POST',
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
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

	it('lets a caller DEFAULT take over and keeps it last', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
	});
});
