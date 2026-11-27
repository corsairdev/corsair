import { ZodError } from 'zod';
import { NtfyAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	bandwidthExceeded,
	forbidden,
	invalidPriority,
	notFound,
	unauthorized,
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
	return errorHandlers[classify(error)].handler?.(error);
}

function apiError(
	status: number,
	// unknown: each case passes one of ntfy's error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	const code = (body as { code?: number }).code;
	return new NtfyAPIError(`ntfy ${status}: failed`, {
		status,
		ntfyCode: typeof code === 'number' ? code : undefined,
		...options,
	});
}

describe('ntfy error handlers', () => {
	it('retries a 429 by status with backoff', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a bandwidth-exceeded poll by its 42905 body code', async () => {
		const error = apiError(429, bandwidthExceeded);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(error.isRateLimit).toBe(true);
	});

	it('matches a 42905 body code on the error getter at any status', () => {
		const error = new NtfyAPIError('bandwidth', { ntfyCode: 42905 });
		expect(error.isRateLimit).toBe(true);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('honours Retry-After when ntfy sends one', async () => {
		const error = apiError(429, {}, { retryAfter: 2000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a bad token', async () => {
		const error = apiError(401, unauthorized);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a read-only or reserved topic', async () => {
		const error = apiError(403, forbidden);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an invalid parameter', async () => {
		const error = apiError(400, invalidPriority);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry the 404 an invalid topic name routes to', async () => {
		const error = apiError(404, notFound);
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

	it.each(['POST', 'PUT', 'DELETE'])(
		'does not replay a failed %s, whose writes are not idempotent',
		async (method) => {
			const error = apiError(500, {}, { method });
			expect(classify(error)).toBe('DEFAULT');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('does not replay a write that timed out', async () => {
		const timeout = new Error('The operation timed out');
		const error = new NtfyAPIError(timeout.message, {
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
});

describe('mergeErrorHandlers', () => {
	const builtin = errorHandlers;

	it('returns the builtin map untouched when no caller handlers exist', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('puts DEFAULT last after merging caller handlers', () => {
		const merged = mergeErrorHandlers(builtin, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
		expect(names).toContain('RATE_LIMIT_ERROR');
	});

	it('keeps a caller DEFAULT when they provide one', () => {
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 9 }),
		};
		const merged = mergeErrorHandlers(builtin, { DEFAULT: callerDefault });
		expect(merged.DEFAULT?.handler).toBe(callerDefault.handler);
	});

	it('gives a caller override precedence by value', () => {
		const retryHandler = {
			match: (error: Error) =>
				error instanceof NtfyAPIError && error.isRateLimit,
			handler: async () => ({ maxRetries: 7 }),
		};
		const merged = mergeErrorHandlers(builtin, {
			RATE_LIMIT_ERROR: retryHandler,
		});
		expect(merged.RATE_LIMIT_ERROR?.handler).toBe(retryHandler.handler);
		// The caller's key position, not the builtin's, decides who runs.
		const names = Object.keys(merged);
		expect(names.indexOf('RATE_LIMIT_ERROR')).toBeLessThan(
			names.indexOf('AUTH_ERROR'),
		);
	});
});
