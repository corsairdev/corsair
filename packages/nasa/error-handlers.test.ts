import type { ErrorHandlerAndMatchFunction } from 'corsair/core';
import { ApiError } from 'corsair/http';
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
	// The builtin handlers declare no parameters, so their inferred type is
	// narrower than ErrorHandler; the cast reads the shared signature.
	const entry = errorHandlers[classify(error)] as ErrorHandlerAndMatchFunction;
	return entry.handler(error, {
		pluginId: 'nasa',
		operation: 'test',
		input: {},
		originalError: error,
	});
}

/** Core's ApiError with api.nasa.gov's `{ error: { code } }` body. */
function apiError(status: number, code?: string) {
	return new ApiError(
		{ method: 'GET', url: '/neo/rest/v1/feed' },
		{
			url: 'https://api.nasa.gov/neo/rest/v1/feed',
			ok: false,
			status,
			statusText: '',
			body: code ? { error: { code, message: 'failed' } } : 'failed',
		},
		`NASA ${status}: failed`,
	);
}

describe('nasa error handlers', () => {
	it('does not replay a 429 core already retried, because the limit is an hourly window', async () => {
		const error = apiError(429, 'OVER_RATE_LIMIT');
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('recognises a rate limit by body code alone', async () => {
		// A gateway in front of api.nasa.gov can drop the status but keep the body.
		const error = apiError(200, 'OVER_RATE_LIMIT');
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('treats a 401 as an auth failure with no retry', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats the 403 NASA sends for a bad key as auth', async () => {
		const error = apiError(403, 'API_KEY_INVALID');
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('recognises a missing key even without the status', async () => {
		const error = apiError(400, 'API_KEY_MISSING');
		expect(classify(error)).toBe('AUTH_ERROR');
	});

	it('does not retry a 400 from the APOD feed', async () => {
		// WordPress puts its code at the top level, not under `error`.
		const error = new ApiError(
			{ method: 'GET', url: '/wp-json/wp/v2/apod-basic' },
			{
				url: 'https://science.nasa.gov/wp-json/wp/v2/apod-basic',
				ok: false,
				status: 400,
				statusText: '',
				body: { code: 'rest_invalid_param', message: 'Invalid parameter(s)' },
			},
			'Bad Request',
		);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404 for an unknown asset', async () => {
		const error = apiError(404);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a schema failure', async () => {
		const error = new Error('bad shape');
		error.name = 'ZodError';
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx on any route, because every route is a read', async () => {
		const error = apiError(500);
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('falls back to DEFAULT for a transport failure', () => {
		expect(classify(new Error('socket hang up'))).toBe('DEFAULT');
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

	it('runs a caller handler for a status no builtin covers', () => {
		const custom = {
			match: (error: Error) =>
				error instanceof ApiError && error.status === 503,
			handler: async () => ({ maxRetries: 9 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, { CUSTOM: custom });

		const failure = apiError(503);
		const firstMatch = Object.entries(merged).find(([, entry]) =>
			entry?.match?.(failure, {
				pluginId: 'nasa',
				operation: 'test',
				input: {},
				originalError: failure,
			}),
		);
		expect(firstMatch?.[0]).toBe('CUSTOM');
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
});
