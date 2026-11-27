import { ZodError } from 'zod';
import { RagieAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	paymentRequired,
	tooManyRequests,
	unauthorized,
	validationDetail,
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
	// unknown: each case passes one of Ragie's error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new RagieAPIError(`Ragie ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('Ragie error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429, tooManyRequests);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After when Ragie sends one', async () => {
		const error = apiError(429, tooManyRequests, { retryAfter: 4000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 4000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never retries a 402 plan limit', async () => {
		const error = apiError(402, paymentRequired);
		expect(classify(error)).toBe('INSUFFICIENT_BALANCE_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401 bad key', async () => {
		const error = apiError(401, unauthorized);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 422 FastAPI validation body', async () => {
		const error = apiError(422, validationDetail);
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

	it.each(['POST', 'PUT', 'PATCH', 'DELETE'])(
		'does not replay a failed %s',
		async (method) => {
			const error = apiError(500, {}, { method });
			expect(classify(error)).toBe('DEFAULT');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('retries a dropped connection on a read', async () => {
		const failure = new TypeError('fetch failed');
		const error = new RagieAPIError('fetch failed', {
			cause: failure,
			method: 'GET',
			transport: true,
		});
		expect(classify(error)).toBe('TRANSPORT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a write that dropped before an answer', async () => {
		const failure = new TypeError('fetch failed');
		const error = new RagieAPIError('fetch failed', {
			cause: failure,
			method: 'POST',
			transport: true,
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a write that timed out', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		const error = new RagieAPIError(timeout.message, {
			cause: timeout,
			method: 'POST',
			transport: true,
		});
		expect(classify(error)).toBe('DEFAULT');
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = errorHandlers;

	it('keeps DEFAULT last and the caller keys first', () => {
		const merged = mergeErrorHandlers(builtin, {
			UPSTREAM_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('UPSTREAM_ERROR')).toBeLessThan(
			names.indexOf('SERVER_ERROR'),
		);
	});

	it('puts a caller handler before the builtin it replaces, so core runs it', () => {
		const customMatch = (error: Error) => statusIs5xx(error);
		const merged = mergeErrorHandlers(builtin, {
			SERVER_ERROR: {
				match: customMatch,
				handler: async () => ({ maxRetries: 5 }),
			},
		});
		const names = Object.keys(merged);
		// The caller's SERVER_ERROR must sit before any builtin that could
		// match the same error first.
		expect(names.indexOf('SERVER_ERROR')).toBeLessThan(
			names.indexOf('TRANSPORT_ERROR'),
		);
		expect(merged.SERVER_ERROR?.match).toBe(customMatch);
	});

	it('lets the caller replace DEFAULT', () => {
		const fallback = {
			match: () => true,
			handler: async () => ({ maxRetries: 9 }),
		};
		const merged = mergeErrorHandlers(builtin, { DEFAULT: fallback });
		expect(merged.DEFAULT).toBe(fallback);
	});

	it('returns the builtins untouched when the caller passes none', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});
});

function statusIs5xx(error: Error): boolean {
	return error instanceof RagieAPIError && (error.status ?? 0) >= 500;
}
