import type { ErrorHandlerAndMatchFunction } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { NeuronwriterAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type HandlerName = keyof typeof errorHandlers;

/** Mirrors corsair core: the first handler whose match() passes, in key order. */
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	const entry = errorHandlers[classify(error)] as ErrorHandlerAndMatchFunction;
	return entry.handler(error, {
		pluginId: 'neuronwriter',
		operation: 'test',
		input: {},
		originalError: error,
	});
}

/** Builds the core `ApiError` the client throws for an HTTP failure. */
function apiError(
	status: number,
	options: { retryAfter?: number } = {},
): ApiError {
	return new ApiError(
		{ method: 'POST', url: '/list-projects' },
		{
			url: 'https://app.neuronwriter.com/neuron-api/0.5/writer/list-projects',
			ok: false,
			status,
			statusText: 'error',
			body: { error: 'Invalid or inactive API key.' },
		},
		'NEURONwriter failed',
		{ retryAfter: options.retryAfter },
	);
}

describe('neuronwriter error handlers', () => {
	it('retries a 429 and passes Retry-After through', async () => {
		const error = apiError(429, { retryAfter: 3000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 3000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401, which is a bad or inactive key', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403, which is a plan without API access', async () => {
		const error = apiError(403);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 422 from an unreadable body', async () => {
		const error = apiError(422);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a schema failure', async () => {
		const error = new Error('bad shape');
		error.name = 'ZodError';
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('does not replay a 5xx, because every method is a POST', async () => {
		// analysis.start spends a monthly credit, so no retry is safe.
		const error = apiError(500);
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for a transport failure', () => {
		expect(classify(new NeuronwriterAPIError('socket hang up'))).toBe(
			'DEFAULT',
		);
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps the caller keys first and DEFAULT last', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		const names = Object.keys(merged);
		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});

	it('uses the caller DEFAULT when both provide one', () => {
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: callerDefault,
		});
		expect(merged.DEFAULT).toBe(callerDefault);
	});

	it('runs a caller handler for a status no builtin covers', () => {
		const custom = {
			match: (error: Error) =>
				error instanceof ApiError && error.status === 502,
			handler: async () => ({ maxRetries: 9 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, { CUSTOM: custom });

		const failure = apiError(502);
		const firstMatch = Object.entries(merged).find(([, entry]) =>
			entry?.match?.(failure, {
				pluginId: 'neuronwriter',
				operation: 'test',
				input: {},
				originalError: failure,
			}),
		);
		expect(firstMatch?.[0]).toBe('CUSTOM');
	});
});
