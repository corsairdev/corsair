import { ZodError } from 'zod';
import { StannpAPIError } from './client';
import { errorHandlers } from './error-handlers';
import { badKey } from './test-fixtures';

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
	// unknown: each case passes one of Stannp's error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new StannpAPIError(`Stannp ${status}: failed`, {
		status,
		body,
		path: '/v1/test',
		method: options.method ?? 'POST',
		retryAfter: options.retryAfter,
	});
}

describe('Stannp error handlers', () => {
	it('retries a 429 with backoff and no header delay', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('waits the documented X-RateLimit-Reset seconds when present', async () => {
		const error = apiError(429, badKey, { retryAfter: 46_000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 46_000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['GET', 'POST'] as const)(
		'classifies a rate-limited %s, which never ran',
		async (method) => {
			const error = apiError(429, {}, { method });
			expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		},
	);

	it('does not retry a 401 from a wrong key', async () => {
		const error = apiError(401, badKey);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 409 idempotent replay', async () => {
		const error = apiError(409, { success: true, data: { id: '41' } });
		expect(classify(error)).toBe('CONFLICT_ERROR');
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

	it('does not replay a failed POST: a create can have posted and charged', async () => {
		const error = apiError(500, {}, { method: 'POST' });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a request that timed out', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		expect(classify(timeout)).toBe('DEFAULT');
		expect(await strategy(timeout)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});
