import { ZodError } from 'zod';
import { HappyScribeAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { rateLimited } from './test-fixtures';

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
	// unknown: each case passes one of HappyScribe's error bodies.
	body: unknown = {},
	options: { retryInSeconds?: number; replaySafe?: boolean } = {},
) {
	return new HappyScribeAPIError(`HappyScribe ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('HappyScribe error handlers', () => {
	it('waits exactly retry_in_seconds on a 429', async () => {
		const error = apiError(429, rateLimited);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 30_000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('falls back to backoff when a 429 carries no retry_in_seconds', async () => {
		const error = apiError(429);
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403', async () => {
		const error = apiError(403);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([410, 422])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('GONE_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])(
		'retries a flagged read that got a %i',
		async (status) => {
			const error = apiError(status, {}, { replaySafe: true });
			expect(classify(error)).toBe('SERVER_ERROR');
			expect(await strategy(error)).toEqual({
				maxRetries: 2,
				retryStrategy: 'exponential_backoff',
			});
		},
	);

	it('does not replay an unflagged 5xx, whatever the method', async () => {
		const error = apiError(503);
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a timeout, whose effect is unknown', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		const error = new HappyScribeAPIError(timeout.message, { cause: timeout });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('keeps DEFAULT last when the caller adds handlers', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 7 }),
			},
		});
		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(merged.MY_ERROR).toBeDefined();
	});
});
