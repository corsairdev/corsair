import { ZodError } from 'zod';
import { ImageKitAPIError } from './client';
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
	// unknown: each case passes one of ImageKit's error bodies.
	body: unknown = {},
	options: { method?: string; replaySafe?: boolean } = {},
) {
	return new ImageKitAPIError(`ImageKit ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('ImageKit error handlers', () => {
	it('retries a 429 with a 1s first backoff', async () => {
		const error = apiError(429, rateLimited);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 1000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([401])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe(
			status === 401 ? 'AUTH_ERROR' : 'PERMISSION_ERROR',
		);
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403 storage-limit denial', async () => {
		const error = apiError(403, {
			message: 'Total storage limit exceeded.',
		});
		expect(classify(error)).toBe('PERMISSION_ERROR');
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

	it.each(['POST', 'DELETE', 'PUT'])(
		'does not replay a failed %s',
		async (method) => {
			const error = apiError(503, {}, { method });
			expect(classify(error)).toBe('DEFAULT');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('does not replay an unflagged GET that got a 5xx', async () => {
		const error = apiError(503, {}, { method: 'GET' });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a timeout, whose effect is unknown', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		const error = new ImageKitAPIError(timeout.message, {
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

	it('keeps DEFAULT last when the caller adds or overrides handlers', () => {
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

	it('lets the caller override a builtin handler', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		});
		expect(merged.AUTH_ERROR).toBeDefined();
	});
});
