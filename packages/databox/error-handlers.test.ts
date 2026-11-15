import { ZodError } from 'zod';
import { DataboxAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	conflictFailed,
	conflictInProgress,
	unauthorized,
	validationError,
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
	status: number | undefined,
	// unknown: each case passes one of Databox's documented error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string; replaySafe?: boolean } = {},
) {
	return new DataboxAPIError(`Databox ${status ?? 'network'}: failed`, {
		status,
		body,
		retryAfter: options.retryAfter,
		method: options.method,
		replaySafe: options.replaySafe,
	});
}

function timeoutError(replaySafe: boolean) {
	return new DataboxAPIError('The operation timed out', {
		cause: new DOMException('The operation timed out', 'TimeoutError'),
		method: 'GET',
		replaySafe,
	});
}

describe('Databox error handlers', () => {
	it('retries a 429 with the header delay', async () => {
		const error = apiError(429, unauthorized, { retryAfter: 30000 });

		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		await expect(strategy(error)).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 30000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a 429 without a header using the backoff strategy', async () => {
		const error = apiError(429);

		await expect(strategy(error)).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a 409 modification_in_progress with its Retry-After', async () => {
		const error = apiError(409, conflictInProgress, { retryAfter: 5000 });

		expect(classify(error)).toBe('CONFLICT_IN_PROGRESS_ERROR');
		await expect(strategy(error)).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 5000,
			retryStrategy: 'linear_1s',
		});
	});

	it('falls back to the documented 5 seconds when the 409 has no header', async () => {
		const error = apiError(409, conflictInProgress);

		await expect(strategy(error)).resolves.toMatchObject({
			headersRetryAfterMs: 5000,
		});
	});

	it('does not retry a final 409 modification_failed', async () => {
		const error = apiError(409, conflictFailed);

		expect(classify(error)).toBe('CONFLICT_ERROR');
		await expect(strategy(error)).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry auth, permission, validation or not-found errors', async () => {
		for (const [error, name] of [
			[apiError(401, unauthorized), 'AUTH_ERROR'],
			[apiError(403, unauthorized), 'PERMISSION_ERROR'],
			[apiError(400, validationError('name')), 'VALIDATION_ERROR'],
			[apiError(404, validationError()), 'VALIDATION_ERROR'],
			[apiError(405, validationError()), 'VALIDATION_ERROR'],
		] as const) {
			expect(classify(error)).toBe(name);
			await expect(strategy(error)).resolves.toEqual({ maxRetries: 0 });
		}
	});

	it('classifies a ZodError as validation', async () => {
		const error = new ZodError([]);

		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('retries a timeout only when the call is replay-safe', async () => {
		expect(classify(timeoutError(true))).toBe('TIMEOUT_ERROR');
		await expect(strategy(timeoutError(true))).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
		await expect(strategy(timeoutError(false))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 5xx only when the call is replay-safe', async () => {
		const read = apiError(502, unauthorized, {
			method: 'GET',
			replaySafe: true,
		});
		expect(classify(read)).toBe('SERVER_ERROR');
		await expect(strategy(read)).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});

		const write = apiError(502, unauthorized, { method: 'POST' });
		expect(classify(write)).toBe('DEFAULT');
		await expect(strategy(write)).resolves.toEqual({ maxRetries: 0 });
	});

	it('sends everything else to DEFAULT without retrying', async () => {
		const error = apiError(418, unauthorized);
		expect(classify(error)).toBe('DEFAULT');
		await expect(strategy(error)).resolves.toEqual({ maxRetries: 0 });
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
		expect(names).toContain('CONFLICT_IN_PROGRESS_ERROR');
	});

	it('returns the builtin handlers unchanged when no user handlers exist', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
