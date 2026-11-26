import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ZodError } from 'zod';
import { GiteaAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// The caller's context argument is required on CorsairErrorHandler; none of
// these handlers read it beyond the shape.
function testContext(originalError: Error): ErrorContext {
	return {
		pluginId: 'gitea',
		operation: 'repos.get',
		input: {},
		originalError,
	};
}

type HandlerName = keyof typeof errorHandlers;

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key]?.match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

// None of the handlers read the second context argument, so the declared
// one-argument signatures are what the map holds.
async function strategy(error: Error) {
	const entry = errorHandlers[classify(error)];
	const handler = entry?.handler;
	if (!handler) return { maxRetries: 0 };
	const result: object = await handler(error);
	return result;
}

function apiError(
	status: number | undefined,
	options: {
		retryAfter?: number;
		replayable?: boolean;
		isTransportFailure?: boolean;
	} = {},
) {
	return new GiteaAPIError(`Gitea ${status ?? 'transport'}: failed`, {
		status,
		body: { message: 'failed', url: 'https://git.example.com/api/swagger' },
		...options,
	});
}

describe('gitea error handlers', () => {
	it('retries a 429 with the documented fallback delay when no header is sent', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 60_000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('waits for retry-after when the instance sends one', async () => {
		const error = apiError(429, { retryAfter: 60_000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 60_000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a rate-limited write too: the provider refused it before running', async () => {
		const error = apiError(429, { replayable: false });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
	});

	it.each([401, 403, 404, 400, 422, 409, 412, 423])(
		'does not retry a %i',
		async (status) => {
			const error = apiError(status, { replayable: true });
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it.each([
		[401, 'AUTH_ERROR'],
		[403, 'PERMISSION_ERROR'],
		[404, 'NOT_FOUND_ERROR'],
		[400, 'VALIDATION_ERROR'],
		[422, 'VALIDATION_ERROR'],
		[409, 'STATE_ERROR'],
		[412, 'STATE_ERROR'],
		[423, 'STATE_ERROR'],
	])('classifies a %i as %s', (status, expected) => {
		expect(classify(apiError(status))).toBe(expected);
	});

	it('does not retry a 5xx on a write, which may already have landed', async () => {
		const error = apiError(500, { replayable: false });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a 5xx twice on a read', async () => {
		const error = apiError(500, { replayable: true });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a transport failure on a read', async () => {
		const error = apiError(undefined, {
			replayable: true,
			isTransportFailure: true,
		});
		expect(error.status).toBeUndefined();
		expect(classify(error)).toBe('TRANSPORT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a transport failure on a write', async () => {
		const error = apiError(undefined, {
			replayable: false,
			isTransportFailure: true,
		});
		expect(classify(error)).toBe('TRANSPORT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 0,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('classifies a ZodError as a validation error', () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('keeps DEFAULT last after a merge, and the caller handler shadows the builtin', async () => {
		// The caller hands core a CorsairErrorHandler, whose handler signature
		// is (error, context); the builtin map keeps its narrower ones.
		const caller: CorsairErrorHandler = {
			SERVER_ERROR: {
				match: (error: Error) =>
					error instanceof GiteaAPIError && (error.status ?? 0) >= 500,
				handler: async () => ({ maxRetries: 0 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, caller);
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');

		// Core takes the first match in key order: with the caller's handler
		// installed, a 500 must resolve to the caller's entry, not the builtin
		// in the builtin's old position.
		const fiveHundred = apiError(500, { replayable: true });
		const first = names.find((name) =>
			merged[name]?.match(fiveHundred, testContext(fiveHundred)),
		);
		expect(first).toBe('SERVER_ERROR');
		// The caller's maxRetries: 0 wins, proving it is their value that runs.
		const entry = merged.SERVER_ERROR;
		expect(entry?.handler).toBeDefined();
		if (entry?.handler) {
			const result: object = await entry.handler(
				fiveHundred,
				testContext(fiveHundred),
			);
			expect(result).toEqual({ maxRetries: 0 });
		}
	});

	it('lets a caller handler under a new key claim a status a builtin also matches', async () => {
		// Core resolves a handler to the first key whose match passes in
		// insertion order. A caller CONFLICT_ERROR must sit before the builtin
		// STATE_ERROR (which also matches 409), or it would never run.
		const caller: CorsairErrorHandler = {
			CONFLICT_ERROR: {
				match: (error: Error) =>
					error instanceof GiteaAPIError && error.status === 409,
				handler: async () => ({
					maxRetries: 1,
					retryStrategy: 'linear_1s' as const,
				}),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, caller);
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('CONFLICT_ERROR')).toBeLessThan(
			names.indexOf('STATE_ERROR'),
		);

		const conflict = apiError(409, { replayable: true });
		const first = names.find((name) =>
			merged[name]?.match(conflict, testContext(conflict)),
		);
		expect(first).toBe('CONFLICT_ERROR');
		const entry = merged.CONFLICT_ERROR;
		expect(entry?.handler).toBeDefined();
		if (entry?.handler) {
			const result: object = await entry.handler(
				conflict,
				testContext(conflict),
			);
			expect(result).toEqual({ maxRetries: 1, retryStrategy: 'linear_1s' });
		}
	});

	it('returns the builtin map unchanged when the caller adds nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
