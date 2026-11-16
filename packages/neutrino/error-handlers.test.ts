import type { ErrorHandlerAndMatchFunction } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { NeutrinoAPIError } from './client';
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
		pluginId: 'neutrino',
		operation: 'test',
		input: {},
		originalError: error,
	});
}

/**
 * Builds the core `ApiError` the client produces: the status, a path, and a
 * sanitized body carrying Neutrino's numeric code.
 */
function apiError(
	status: number,
	options: { code?: number; path?: string; retryAfter?: number } = {},
): ApiError {
	const path = options.path ?? '/ip-info';
	const body =
		options.code === undefined
			? undefined
			: {
					'api-error': options.code,
					'api-error-msg': 'ACCESS DENIED. USER ID OR API KEY INVALID',
				};
	return new ApiError(
		{ method: 'GET', url: path },
		{
			url: `https://neutrinoapi.net${path}`,
			ok: false,
			status,
			statusText: 'error',
			body,
		},
		'Neutrino failed',
		{ retryAfter: options.retryAfter },
	);
}

describe('neutrino error handlers', () => {
	it('retries a 429 with backoff and passes Retry-After through', async () => {
		const error = apiError(429, { retryAfter: 2000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('treats code 43 as a bad credential', async () => {
		const error = apiError(403, { code: 43 });
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats a 403 with another code as a plan limit, not a bad key', async () => {
		expect(classify(apiError(403, { code: 12 }))).toBe('PERMISSION_ERROR');
	});

	it('does not retry a 400 for a bad parameter', async () => {
		const error = apiError(400, { code: 21 });
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a schema failure', async () => {
		const error = new Error('bad shape');
		error.name = 'ZodError';
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx on an ordinary read', async () => {
		const error = apiError(500);
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never replays a 5xx from the SMS send, which may have gone out', async () => {
		// The route sends a real SMS, so a 5xx could mean the message landed.
		const error = apiError(500, { path: '/sms-verify' });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for a transport failure', () => {
		expect(classify(new NeutrinoAPIError('socket hang up'))).toBe('DEFAULT');
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
				error instanceof ApiError && error.status === 502,
			handler: async () => ({ maxRetries: 9 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, { CUSTOM: custom });

		const failure = apiError(502);
		const firstMatch = Object.entries(merged).find(([, entry]) =>
			entry?.match?.(failure, {
				pluginId: 'neutrino',
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
