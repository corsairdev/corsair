import { ZodError } from 'zod';
import { GrafbaseAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

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
	options: {
		// unknown: each case passes one of the error bodies Grafbase sends.
		errors?: { message: string }[];
		retryAfter?: number;
		operationKind?: 'query' | 'mutation';
	} = {},
) {
	return new GrafbaseAPIError('Grafbase request failed', {
		status,
		errors: options.errors ?? [],
		retryAfter: options.retryAfter,
		operationKind: options.operationKind,
	});
}

describe('Grafbase error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429, { operationKind: 'query' });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a rate-limited mutation, which Grafbase answered before work started', async () => {
		const error = apiError(429, { operationKind: 'mutation' });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('honours Retry-After when Grafbase sends one', async () => {
		const error = apiError(429, { retryAfter: 2000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([401, 403])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an unauthorized GraphQL failure with HTTP 200', async () => {
		const error = apiError(undefined, {
			errors: [{ message: 'Unauthorized' }],
		});
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a GraphQL-level failure', async () => {
		const error = apiError(undefined, {
			errors: [{ message: 'Cannot query field "viewerX" on type "Query".' }],
		});
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('retries a query that got a %i', async (status) => {
		const error = apiError(status, { operationKind: 'query' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a failed mutation', async () => {
		const error = apiError(500, { operationKind: 'mutation' });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a mutation that timed out', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		const error = new GrafbaseAPIError(timeout.message, {
			cause: timeout,
			operationKind: 'mutation',
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
	// unknown: core passes a full ErrorContext; these calls only exercise
	// matching and the returned retry strategy.
	const context = {
		pluginId: 'grafbase',
		operation: 'merge',
		input: {},
		originalError: new Error('anything'),
	};

	it('runs caller handlers first and keeps DEFAULT last', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CATCH_ALL: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
		});
		const names = Object.keys(merged);
		expect(names[0]).toBe('CATCH_ALL');
		expect(names.at(-1)).toBe('DEFAULT');
		// The first match wins, so the caller handler answers before the
		// built-in RATE_LIMIT_ERROR, AUTH_ERROR or SERVER_ERROR matches.
		expect(merged.CATCH_ALL?.match(context.originalError, context)).toBe(true);
		expect(
			await merged.CATCH_ALL?.handler(context.originalError, context),
		).toEqual({
			maxRetries: 7,
		});
	});

	it('lets a caller handler replace a builtin under the same key', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			RATE_LIMIT_ERROR: {
				match: (error: Error) =>
					error instanceof GrafbaseAPIError && error.status === 429,
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		const names = Object.keys(merged);
		expect(names[0]).toBe('RATE_LIMIT_ERROR');
		expect(names.filter((key) => key === 'RATE_LIMIT_ERROR')).toHaveLength(1);
		expect(
			await merged.RATE_LIMIT_ERROR?.handler(
				new GrafbaseAPIError('x', { status: 429 }),
				context,
			),
		).toEqual({ maxRetries: 1 });
	});
});
